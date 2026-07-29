const multer = require('multer');

const AppError = require('../errors/AppError');

const multerErrorMessages = {
  LIMIT_FILE_SIZE: 'Uploaded file exceeds the maximum allowed size.',
  LIMIT_FILE_COUNT: 'Too many files were uploaded.',
  LIMIT_FIELD_COUNT: 'Too many fields were submitted.',
  LIMIT_UNEXPECTED_FILE: 'An unexpected file was uploaded.',
  LIMIT_PART_COUNT: 'Too many multipart parts were submitted.',
  LIMIT_FIELD_KEY: 'A submitted field name is too long.',
  LIMIT_FIELD_VALUE: 'A submitted field value is too long.',
};

function errorHandler(error, request, response, _next) {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({
      success: false,

      message: multerErrorMessages[error.code] || 'Invalid file upload.',

      details: {
        code: error.code,
        field: error.field || null,
      },
    });
  }

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    Object.prototype.hasOwnProperty.call(error, 'body')
  ) {
    return response.status(400).json({
      success: false,
      message: 'Invalid JSON payload.',
    });
  }

  if (error instanceof AppError) {
    const payload = {
      success: false,
      message: error.message,
    };

    if (error.details !== null) {
      payload.details = error.details;
    }

    return response.status(error.statusCode || 500).json(payload);
  }

  console.error({
    name: error.name,
    message: error.message,
    stack: error.stack,
    method: request.method,
    path: request.path,
    userId: request.authenticatedUserId || null,
  });

  return response.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = errorHandler;
