const AppError = require('../errors/AppError');

function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
      file: request.file,
      files: request.files,
    });

    if (!result.success) {
      return next(new AppError('Validation failed', 400, result.error.flatten()));
    }

    request.validated = result.data;

    return next();
  };
}

module.exports = validate;
