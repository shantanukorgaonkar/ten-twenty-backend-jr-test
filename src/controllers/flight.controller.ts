import { Request, Response, NextFunction } from 'express';
import { SearchFlightsDto } from '../dto/flight.dto';
import { ApiError } from '../middleware/error-handler.middleware';
import * as flightService from '../services/flight.service'

/**
 * Handles the flight search API request.
 */
export const searchFlightsController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { origin, destination, departureDate, passengers } = req.query

        const flights = await flightService.searchFlights({ origin, departureDate, destination, passengers } as SearchFlightsDto);

        if (flights.length === 0) {
            res.status(200).json({ message: 'No flights found matching your criteria.', flights: [] });
            return
        }

        res.status(200).json(flights);
    } catch (error: any) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Internal server error during flight search'));
    }
};
