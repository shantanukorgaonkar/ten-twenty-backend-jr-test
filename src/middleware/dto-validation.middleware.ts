import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ApiError } from './error-handler.middleware';

export enum ValidationSource {
    BODY = 'body',
    QUERY = 'query',
}

/**
 * Middleware for request data validation using DTOs and class-validator.
 * @param type - The DTO class to validate against (e.g., RegisterDto, SearchFlightsDto).
 * @param source - Where to find the data for validation (body, query, etc.). Defaults to BODY.
 */
export function validationMiddleware<T>(
    type: new () => T,
    source: ValidationSource = ValidationSource.BODY,
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Determine the data source based on the 'source' parameter
        const dataToValidate = req[source];

        if (!dataToValidate) {
            return next(new ApiError(400, 'Validation failed', 'Body cannot be empty.'));
        }

        const dtoInstance = plainToInstance(type, dataToValidate);

        const errors: ValidationError[] = await validate(dtoInstance as object, { skipMissingProperties: false });

        if (errors.length > 0) {
            let errorMessages: string[] = []

            errors.forEach(error => {
                if (error.constraints) {
                    // Get all constraint messages for the current property
                    const messages = Object.values(error.constraints);
                    if (messages.length > 0) {
                        errorMessages.push(...messages)
                    }
                }
            });

            next(new ApiError(400, 'Validation failed', errorMessages));
        } else {
            if (source === ValidationSource.QUERY) {
                // If it's a query, iterate and assign properties individually
                for (const key in dtoInstance) {
                    if (Object.prototype.hasOwnProperty.call(dtoInstance, key)) {
                        (req as any)[source][key] = (dtoInstance as any)[key];
                    }
                }
            } else {
                (req as any)[source] = dtoInstance;
            }
            next();
        }
    };
}

