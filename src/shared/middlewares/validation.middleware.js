const AppError = require('../errors/AppError');

const storageProvider = require('../providers/storage/local.provider');

function validate(schema) {
  return async (request, response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
      file: request.file,
    });

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

    const { body, params, query, file } = result.data;

    if (body !== undefined) {
      request.body = body;
    }

    if (params !== undefined) {
      request.params = params;
    }

    if (query !== undefined) {
      request.query = query;
    }

    if (file !== undefined) {
      request.file = file;
    }

    request.validated = result.data;

    return next();
  };
}

module.exports = validate;
