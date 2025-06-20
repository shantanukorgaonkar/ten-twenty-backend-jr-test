import { query } from '../db';
import { User, UserLogin, JwtPayload } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../middleware/error-handler.middleware';

const SALT_ROUNDS = 10;

/**
 * Registers a new user.
 * Hashes the password before storing it.
 * @param user - User object with name, email, and plain password.
 * @returns The newly created user (without the password).
 */
export const registerUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<{ newUser: Omit<User, 'password'>, token: string }> => {
    const { name, email, password } = user;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        const { rows } = await query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, "createdAt"',
            [name, email, hashedPassword]
        );
        const newUser = rows[0]
        const jwtPayload: JwtPayload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        };

        if (!config.jwtSecret) {
            throw new ApiError(500, 'JWT secret is not configured.');
        }

        const token = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: '8h' });

        return { newUser, token }
    } catch (error: any) {
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Stack: ${error.stack}`);
        if (error.code === '23505') { // PostgreSQL error code for unique_violation
            throw new ApiError(400, 'Email already registered.');
        }
        throw error
    }
};

/**
 * Logs in a user.
 * Compares the provided password with the stored hashed password.
 * Generates a JWT upon successful login.
 * @param credentials - UserLogin object with email and password.
 * @returns An object containing the JWT and user details (without password).
 */
export const loginUser = async (credentials: UserLogin) => {
    const { email, password } = credentials;

    try {
        const { rows } = await query('SELECT id, name, email, password FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
            throw new ApiError(400, 'Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(400, 'Invalid credentials');
        }

        const jwtPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        if (!config.jwtSecret) {
            throw new ApiError(500, 'JWT secret is not configured.');
        }

        const token = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: '8h' });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    } catch (error: any) {
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Stack: ${error.stack}`);
        throw error
    }
};
