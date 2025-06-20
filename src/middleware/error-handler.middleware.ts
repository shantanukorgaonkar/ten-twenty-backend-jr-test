import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    data?: any;
}
export class ApiError extends Error implements CustomError {
    statusCode: number;
    data?: any;

    constructor(statusCode: number, message: string, data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
/**
 * Global Error Handling Middleware
 * This middleware catches errors that are thrown or passed to `next()`
 * in your routes and other middleware.
 */
export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let data: any = undefined;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        data = err.data;
    }

    const errorResponse: { message: string; stack?: string; data?: any } = {
        message: message,
    };

    if (data) {
        errorResponse.data = err.data;
    }

    res.status(statusCode).json(errorResponse);
};
