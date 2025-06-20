import { Router } from 'express';
import * as flightController from '../controllers/flight.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validationMiddleware, ValidationSource } from '../middleware/dto-validation.middleware';
import { SearchFlightsDto } from '../dto/flight.dto';

const router = Router();

router.get(
    '/search',
    authenticateToken,
    validationMiddleware(SearchFlightsDto, ValidationSource.QUERY),
    flightController.searchFlightsController
);

export default router;