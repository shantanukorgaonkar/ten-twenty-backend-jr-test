import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validationMiddleware } from '../middleware/dto-validation.middleware';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
const router = Router();

router.post('/register', validationMiddleware(RegisterDto), authController.register);
router.post('/login', validationMiddleware(LoginDto), authController.login);

export default router;