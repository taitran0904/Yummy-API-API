const ErrorResponse = require('../utils/errorResponse');

module.exports = function (err, req, res, next) {
  let error = { ...err };
  error.message = err.message;
  if (err.name === 'CastError') {
    error = new ErrorResponse('Resource not found', 404);
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
  });
};
