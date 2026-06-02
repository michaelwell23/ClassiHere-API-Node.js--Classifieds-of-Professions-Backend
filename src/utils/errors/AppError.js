class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode;
    this.datails = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
