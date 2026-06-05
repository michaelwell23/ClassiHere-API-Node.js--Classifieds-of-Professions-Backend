const AppError = require('../errors/AppError');

function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);

  return response.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = errorHandler;
