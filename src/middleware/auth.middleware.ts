import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../models/user.model';
import { ApiError } from './error-handler.middleware';

// Extend the Express Request type to include a 'user' property after authentication
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware to authenticate requests using JWT.
 * Extracts token from 'Authorization' header, verifies it,
 * and attaches the decoded payload to `req.user`.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return next(new ApiError(401, 'Authentication token required.'));
    }

    if (!config.jwtSecret) {
        console.error('JWT_SECRET is not configured in environment variables!');
        return next(new ApiError(500, 'Server configuration error.'));
    }

    // Verify the token
    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return next(new ApiError(403, 'Invalid or expired token.'));
        }
        req.user = user as JwtPayload;
        next();
    });
};
