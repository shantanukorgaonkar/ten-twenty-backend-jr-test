import { PoolClient } from 'pg';
import { getClient } from '../db';
import { Flight } from '../models/flight.model';
import { Booking } from '../models/booking.model';
import { BookFlightDto } from '../dto/booking.dto';
import { ApiError } from '../middleware/error-handler.middleware';
import { DateTime } from 'luxon';


/**
 * Books a flight for a user.
 * This operation is performed within a transaction to ensure atomicity.
 * @param userId - The ID of the user booking the flight.
 * @param bookingDetails - Details about the booking
 * @returns The created Booking record.
 */
export const bookFlight = async (userId: number, bookingDetails: BookFlightDto): Promise<Booking> => {
    const { flightId, numberOfSeats, bookingDate } = bookingDetails;
    let client: PoolClient | null = null;
    const bookingDay = DateTime.fromISO(bookingDate)
    const bookingDayNumber = bookingDay.weekday
    try {
        client = await getClient();
        await client.query('BEGIN');

        const flightResult = await client.query<Flight>(
            'SELECT id, "availableSeats", "operationalDays", "flightNumber" FROM flights WHERE id = $1 FOR UPDATE;',
            [flightId]
        );

        const flight = flightResult.rows[0];

        if (!flight) {
            throw new ApiError(404, 'Flight not found.');
        }
        if (!flight.operationalDays || flight.operationalDays.length === 0) {
            throw new ApiError(400, 'Flight has no operational days defined.');
        }
        if (flight.availableSeats < numberOfSeats) {
            throw new ApiError(409, `Not enough available seats. Only ${flight.availableSeats} seats remaining.`);
        }
        const isOperationalDay = flight.operationalDays.includes(bookingDayNumber);

        if (!isOperationalDay) {
            throw new ApiError(400, `Flight ${flight.flightNumber} does not operate on the given day.`);
        }

        const updateFlightResult = await client.query(
            'UPDATE flights SET "availableSeats" = "availableSeats" - $1 WHERE id = $2 RETURNING "availableSeats";',
            [numberOfSeats, flightId]
        );

        if (updateFlightResult.rows[0].available_seats < 0) {
            throw new ApiError(409, 'Overbooking detected after update, rolling back.');
        }

        const bookingResult = await client.query<Booking>(
            `INSERT INTO Bookings ("flightId", "userId", "numberOfSeats", "bookingDate")
             VALUES ($1, $2, $3, $4) RETURNING id, "flightId", "userId", "numberOfSeats", "bookingDate";`,
            [flightId, userId, numberOfSeats, bookingDay.toISO()]
        );

        await client.query('COMMIT');
        return bookingResult.rows[0];

    } catch (error: any) {
        if (client) {
            await client.query('ROLLBACK');
            console.error('Transaction rolled back due to error');
        }
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Stack: ${error.stack}`);
        throw error
    } finally {
        if (client) {
            client.release();
        }
    }
};