const AppError = require('../errors/AppError');

const storageProvider = require('../providers/storage/local.provider');

function validate(schema) {
  return async (request, response, next) => {
    const payload = {};

    if (request.body && Object.keys(request.body).length > 0) {
      payload.body = request.body;
    }

    if (request.params && Object.keys(request.params).length > 0) {
      payload.params = request.params;
    }

    if (request.query && Object.keys(request.query).length > 0) {
      payload.query = request.query;
    }

    if (request.file) {
      payload.file = request.file;
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      const validationError = new AppError('Validation failed', 400, result.error.flatten());

      if (request.file?.path) {
        try {
          await storageProvider.delete(request.file.path);
        } catch (cleanupError) {
          validationError.cleanupError = cleanupError;
        }
      }

      return next(validationError);
    }

    if (result.data.body !== undefined) {
      request.body = result.data.body;
    }

    if (result.data.params !== undefined) {
      request.params = result.data.params;
    }

    if (result.data.query !== undefined) {
      request.query = result.data.query;
    }

    if (result.data.file !== undefined) {
      request.file = result.data.file;
    }

    request.validated = result.data;

    return next();
  };
}

module.exports = validate;
