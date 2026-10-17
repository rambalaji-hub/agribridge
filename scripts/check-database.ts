import dotenv from 'dotenv';
import { checkDatabase, closeDatabase } from '../server/database';

dotenv.config({ path: ['.env.local', '.env'] });

try {
  const connected = await checkDatabase();
  if (!connected) {
    console.error('MySQL connection test failed. Check DB_* settings and confirm the database server is running.');
    process.exitCode = 1;
  } else {
    console.log('MySQL connection test succeeded.');
  }
} finally {
  await closeDatabase();
}
