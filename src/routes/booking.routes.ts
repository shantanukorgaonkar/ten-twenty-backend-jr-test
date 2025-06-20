import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/dto-validation.middleware';
import { BookFlightDto } from '../dto/booking.dto';

const router = Router();

router.post('/', authenticateToken, validationMiddleware(BookFlightDto), bookingController.bookFlightController);

export default router;