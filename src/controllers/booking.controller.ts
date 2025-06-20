import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { ApiError } from '../middleware/error-handler.middleware';
import { BookFlightDto } from '../dto/booking.dto';


/**
 * Handles the flight booking API request.
 */
export const bookFlightController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingDetails = req.body as BookFlightDto;
        const { flightId, numberOfSeats, bookingDate } = bookingDetails;
        if (!req.user || !req.user.id) {
            throw new ApiError(401, 'User not authenticated.');
        }
        const newBooking = await bookingService.bookFlight(req.user.id, { flightId, numberOfSeats, bookingDate });
        res.status(201).json({ message: 'Flight booked successfully!', booking: newBooking });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Internal server error during flight booking'));
    }
};