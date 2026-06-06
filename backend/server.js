import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import employeeRoutes from './routes/employeeRoutes.js';
import { testConnection } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
testConnection();

// Middlewares
app.use(cors({
  origin: '*', // In production, refine this to match the client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Mount routes
app.use('/api/employees', employeeRoutes);

// Fallback 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handler middleware
app.use(errorHandler);

// Listen for connections
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
