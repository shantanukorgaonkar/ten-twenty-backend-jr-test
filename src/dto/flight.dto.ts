import { Type } from 'class-transformer';
import 'reflect-metadata';
import { IsString, IsDateString, IsInt, Min, MaxLength, IsOptional, IsISO8601 } from 'class-validator';

export class SearchFlightsDto {
    @IsOptional()
    @IsString({ message: 'Origin must be a string' })
    @MaxLength(3, { message: 'Origin must be a 3-letter IATA code (e.g., DEL)' })
    origin?: string;

    @IsOptional()
    @IsString({ message: 'Destination must be a string' })
    @MaxLength(3, { message: 'Destination must be a 3-letter IATA code (e.g., BOM)' })
    destination?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Departure date must be a valid date string' })
    @IsISO8601({ strict: true }, { message: 'Booking date must be a valid ISO string' })
    departureDate?: string;

    @IsOptional()
    @IsInt({ message: 'Number of passengers must be an integer' })
    @Min(1, { message: 'Number of passengers must be at least 1' })
    @Type(() => Number)
    passengers?: number;
}