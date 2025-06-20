import { query } from '../db';
import { SearchFlightsDto } from '../dto/flight.dto';
import { ApiError } from '../middleware/error-handler.middleware';
import { Flight } from '../models/flight.model';

/**
 * Searches for flights based on provided criteria.
 * @param criteria - An object containing origin, destination, departure date, and number of passengers.
 * @returns An array of matching Flight objects.
 */
export const searchFlights = async (criteria: SearchFlightsDto): Promise<Flight[]> => {
  const { origin, destination, departureDate, passengers } = criteria;

  let sql = `
    SELECT
      id, "flightNumber", origin, destination,
      departure, arrival, "availableSeats", price
    FROM
      flights 
  `;


  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;
  if (origin) {
    conditions.push(`origin ILIKE $${paramIndex++}`);
    params.push(`%${origin.toUpperCase()}%`);
  }

  if (destination) {
    conditions.push(`destination ILIKE $${paramIndex++}`);
    params.push(`%${destination.toUpperCase()}%`);
  }

  if (departureDate) {
    conditions.push(`DATE(departure) = DATE($${paramIndex++})`);
    params.push(departureDate);
  }

  if (passengers !== undefined && passengers !== null) {
    conditions.push(`"availableSeats" >= $${paramIndex++}`);
    params.push(passengers);
  }
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }
  sql += ` ORDER BY departure ASC;`;
  try {
    const { rows } = await query(sql, params);
    return rows as Flight[];
  } catch (error: any) {
    console.error(`Error Message: ${error.message}`);
    console.error(`Error Stack: ${error.stack}`);
    throw error
  }
};
