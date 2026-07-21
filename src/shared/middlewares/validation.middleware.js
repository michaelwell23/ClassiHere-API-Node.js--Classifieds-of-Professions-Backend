const AppError = require('../errors/AppError');

function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
      file: request.file,
    });

    if (!result.success) {
      return next(new AppError('Validation failed', 400, result.error.flatten()));
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
