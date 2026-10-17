import mysql, { Pool, RowDataPacket } from 'mysql2/promise';

let pool: Pool | undefined;

export function getDatabase(): Pool {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Database is not configured. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.');
  }

  pool ??= mysql.createPool({
    host: DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: DB_USER,
    password: DB_PASSWORD || '',
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    decimalNumbers: true,
  });
  return pool;
}

export async function closeDatabase(): Promise<void> {
  await pool?.end();
  pool = undefined;
}

export async function checkDatabase(): Promise<boolean> {
  try {
    const [rows] = await getDatabase().query<RowDataPacket[]>('SELECT 1 AS connected');
    return rows[0]?.connected === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
