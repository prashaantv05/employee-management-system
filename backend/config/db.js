import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'employee_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to test DB connection on startup
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the MySQL database pool.');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit process if unable to connect to DB
  }
};

export default pool;
