import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ApiError } from '../middleware/error-handler.middleware';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

/**
 * Handles user registration request.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body as RegisterDto;
        const result = await authService.registerUser({ name, email, password });
        res.status(201).json({ message: 'User registered successfully', user: result.newUser, token: result.token });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return next(error);
        } else {
            next(new ApiError(500, 'Error during user registeration'));
        }
    }
};

/**
 * Handles user login request.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as LoginDto;
        const { token, user } = await authService.loginUser({ email, password });
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return next(error);
        } else {
            next(new ApiError(500, 'Error during user login'));
        }
    }
};

