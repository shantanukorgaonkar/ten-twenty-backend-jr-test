import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, Min, IsDateString, isISO8601, IsISO8601 } from 'class-validator';
import 'reflect-metadata';

export class BookFlightDto {
    @IsNotEmpty({ message: 'Flight ID is required' })
    @IsString({ message: 'Flight ID must be a string' })
    flightId!: string;

    @IsNotEmpty({ message: 'Number of seats to book is required' })
    @IsInt({ message: 'Number of seats must be an integer' })
    @Min(1, { message: 'Number of seats must be at least 1' })
    @Type(() => Number)
    numberOfSeats!: number;


    @IsNotEmpty({ message: 'Booking date is required' })
    @IsISO8601({ strict: true, strictSeparator: true }, { message: 'Booking date must be a valid ISO string' })
    bookingDate!: string
}