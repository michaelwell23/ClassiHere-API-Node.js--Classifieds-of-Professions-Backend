class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);

    this.name = 'AppError';

    this.statusCode =
      Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599 ? statusCode : 500;

    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace?.(this, AppError);
  }
}

module.exports = AppError;
