import express from 'express';
import { ApiError, errorHandler } from './middleware/error-handler.middleware';
import authRoutes from './routes/auth.routes';
import flightRoutes from './routes/flight.routes';
import bookingRoutes from './routes/booking.routes';
const app = express();

// Global Middleware
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/booking', bookingRoutes);

app.use((req, res, next) => {
    // If no route handled the request, it means it's a 404
    next(new ApiError(404, `Not Found - ${req.originalUrl}`));
});

// Error Handling Middleware
app.use(errorHandler);
export default app;