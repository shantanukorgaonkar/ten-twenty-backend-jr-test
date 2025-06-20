import { Pool } from 'pg';
import { config } from '../config';
import { Flight } from '../models/flight.model';

const pool = new Pool(config.database);

const flightsData: Omit<Flight, 'id'>[] = [
    {
        airline: 'Jet Airways',
        airlineCode: '9W',
        flightNumber: 186,
        origin: 'PNQ',
        availableSeats: 116,
        destination: 'DEL',
        price: 6733,
        arrival: new Date('2013-01-01T10:59:00.000Z'),
        departure: new Date('2013-01-01T13:32:00.000Z'),
        duration: 153,
        operationalDays: [0, 2]
    },
    {
        airline: 'Jet Airways',
        airlineCode: '9W',
        flightNumber: 251,
        origin: 'PNQ',
        availableSeats: 53,
        destination: 'DEL',
        price: 8713,
        arrival: new Date('2013-01-04T08:17:00.000Z'),
        departure: new Date('2013-01-04T10:54:00.000Z'),
        duration: 157,
        operationalDays: [7]
    },
    {
        airline: 'Indigo',
        airlineCode: '6E',
        flightNumber: 224,
        origin: 'PNQ',
        availableSeats: 87,
        destination: 'DEL',
        price: 5996,
        arrival: new Date('2013-02-01T03:09:00.000Z'),
        departure: new Date('2013-02-01T05:25:00.000Z'),
        duration: 136,
        operationalDays: [7]
    },
    {
        airline: 'Air India',
        airlineCode: 'AI',
        flightNumber: 192,
        origin: 'PNQ',
        availableSeats: 28,
        destination: 'DEL',
        price: 3652,
        arrival: new Date('2013-01-01T09:30:00.000Z'),
        departure: new Date('2013-01-01T11:31:00.000Z'),
        duration: 121,
        operationalDays: [7]
    },
    {
        airline: 'Spice Jet',
        airlineCode: 'SG',
        flightNumber: 241,
        origin: 'PNQ',
        availableSeats: 29,
        destination: 'DEL',
        price: 7413,
        arrival: new Date('2013-01-01T13:55:00.000Z'),
        departure: new Date('2013-01-01T15:43:00.000Z'),
        duration: 108,
        operationalDays: [7]
    },
    {
        airline: 'Vistara',
        airlineCode: 'UK',
        flightNumber: 801,
        origin: 'PNQ',
        availableSeats: 90,
        destination: 'BLR',
        price: 5200,
        arrival: new Date('2013-02-01T07:00:00.000Z'),
        departure: new Date('2013-02-01T08:30:00.000Z'),
        duration: 90,
        operationalDays: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        airline: 'GoAir',
        airlineCode: 'G8',
        flightNumber: 333,
        origin: 'BOM',
        availableSeats: 65,
        destination: 'DEL',
        price: 3500,
        arrival: new Date('2013-01-04T09:15:00.000Z'),
        departure: new Date('2013-01-04T11:00:00.000Z'),
        duration: 105,
        operationalDays: [1, 3, 5]
    },
    {
        airline: 'AirAsia',
        airlineCode: 'I5',
        flightNumber: 789,
        origin: 'DEL',
        availableSeats: 120,
        destination: 'BLR',
        price: 4100,
        arrival: new Date('2013-01-02T14:00:00.000Z'),
        departure: new Date('2013-01-02T16:20:00.000Z'),
        duration: 140,
        operationalDays: [0, 2, 4, 6]
    },
    {
        airline: 'Spice Jet',
        airlineCode: 'SG',
        flightNumber: 205,
        origin: 'CCU',
        availableSeats: 40,
        destination: 'BOM',
        price: 6200,
        arrival: new Date('2013-01-02T18:30:00.000Z'),
        departure: new Date('2013-01-02T20:45:00.000Z'),
        duration: 135,
        operationalDays: [7]
    },
    {
        airline: 'Vistara',
        airlineCode: 'UK',
        flightNumber: 802,
        origin: 'BLR',
        availableSeats: 75,
        destination: 'PNQ',
        price: 5300,
        arrival: new Date('2013-01-03T10:00:00.000Z'),
        departure: new Date('2013-01-03T11:30:00.000Z'),
        duration: 90,
        operationalDays: [1, 2, 3, 4, 5, 6, 7]
    },
    {
        airline: 'Vistara',
        airlineCode: 'UK',
        flightNumber: 999,
        origin: 'GOX',
        availableSeats: 75,
        destination: 'BLR',
        price: 2500,
        arrival: new Date('2013-02-01T10:00:00.000Z'),
        departure: new Date('2013-02-01T11:30:00.000Z'),
        duration: 90,
        operationalDays: [1, 2, 3, 4, 5, 6, 7]
    }
];
async function seedDatabase(): Promise<void> {
    const client = await pool.connect();

    try {
        console.log('Connected to PostgreSQL database.');


        console.log('Truncating existing Bookings data and restarting identity sequence...');
        await client.query('TRUNCATE TABLE Bookings RESTART IDENTITY CASCADE;');

        console.log('Truncating existing Flights data and restarting identity sequence...');
        await client.query('TRUNCATE TABLE Flights RESTART IDENTITY CASCADE;');

        console.log('Truncating existing Users data and restarting identity sequence...');
        await client.query('TRUNCATE TABLE Users RESTART IDENTITY CASCADE;');

        console.log('All existing data truncated and identity sequences restarted.');
        const insertQuery: string = `
            INSERT INTO Flights (airline, "airlineCode", "flightNumber", origin, "availableSeats", destination, price, departure, arrival, duration, "operationalDays")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        for (const flight of flightsData) {
            const values = [
                flight.airline,
                flight.airlineCode,
                flight.flightNumber,
                flight.origin,
                flight.availableSeats,
                flight.destination,
                flight.price,
                flight.departure,
                flight.arrival,
                flight.duration,
                flight.operationalDays
            ];
            await client.query(insertQuery, values);
            console.log(`Inserted flight: ${flight.airline} ${flight.flightNumber}`);
        }

        console.log('All flight records inserted successfully!');

    } catch (err: any) {
        console.error('Error seeding database:', err.message || err);
        process.exit(1);
    } finally {
        client.release();
        console.log('Disconnected from PostgreSQL database.');
        process.exit(0);
    }
}

seedDatabase();