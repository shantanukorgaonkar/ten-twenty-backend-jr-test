import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool(config.database);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export const getClient = () => {
    return pool.connect().then((client) => client)
};