const multer = require('multer');

const AppError = require('../errors/AppError');

function errorHandler(error, request, response, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response.status(413).json({
        success: false,

        message: 'Uploaded file exceeds the maximum allowed size.',
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT' || error.code === 'LIMIT_UNEXPECTED_FILE') {
      return response.status(400).json({
        success: false,

        message: 'Invalid file upload request.',
      });
    }

    return response.status(400).json({
      success: false,

      message: 'Unable to process uploaded file.',
    });
  }

  if (error instanceof AppError) {
    const responseBody = {
      success: false,
      message: error.message,
    };

    if (error.details) {
      responseBody.details = error.details;
    }

    return response.status(error.statusCode).json(responseBody);
  }

  console.error({
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,

    cleanupError: error.cleanupError
      ? {
          name: error.cleanupError.name,

          message: error.cleanupError.message,
        }
      : undefined,
  });

  return response.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = errorHandler;
