import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool(config.database);

const createTablesQuery: string = `
    CREATE TABLE IF NOT EXISTS Flights (
        id SERIAL PRIMARY KEY,
        airline VARCHAR(255),
        "airlineCode" VARCHAR(10),
        "flightNumber" INT,
        origin VARCHAR(10),
        "availableSeats" INT,
        destination VARCHAR(10),
        price INT,
        departure TIMESTAMP,
        arrival TIMESTAMP,
        duration INT,
        "operationalDays" INTEGER[]
    );

    CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "deletedAt" TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Bookings (
        id SERIAL PRIMARY KEY,
        "flightId" INT NOT NULL,
        "userId" INT NOT NULL,
        "bookingDate" TIMESTAMP,
        "numberOfSeats" INT NOT NULL,
        FOREIGN KEY ("flightId") REFERENCES Flights(id) ON DELETE CASCADE,
        FOREIGN KEY ("userId") REFERENCES Users(id) ON DELETE CASCADE
    );
`;

async function createTables(): Promise<void> {

    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database.');

        console.log('Creating Flights table...');
        await client.query(createTablesQuery);
        console.log('Flights table created or already exists.');

        client.release();
        console.log('Disconnected from PostgreSQL database.');
    } catch (err: any) {
        console.log('pp');

        console.error('Error creating tables:', err.message || err);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

createTables();
