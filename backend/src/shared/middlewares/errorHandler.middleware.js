import { StatusCodes } from 'http-status-codes';

export const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Image must be smaller than 5MB' });
  }
  if (err.message === 'Only JPEG, PNG, and WebP images are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
