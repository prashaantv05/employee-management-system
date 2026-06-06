export const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack || err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific MySQL errors if they bubble up
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry error: A record with this unique value already exists.';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Database connection error. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
