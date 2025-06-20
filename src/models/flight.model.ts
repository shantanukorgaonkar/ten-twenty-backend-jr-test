export interface Flight {
    id: number;
    airline: string;
    airlineCode: string;
    flightNumber: number;
    origin: string;
    availableSeats: number;
    destination: string;
    price: number;
    departure: Date;
    arrival: Date;
    duration: number;
    operationalDays: number[];
}