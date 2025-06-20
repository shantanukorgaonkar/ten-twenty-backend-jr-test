import app from './app';
import { config } from './config';
import { getClient } from './db';

const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    const client = await getClient();
    await client.query('SELECT 1');
    console.log('Database connection established.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});