const AppError = require('../errors/AppError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(new AppError('Validation failed', 400, errors));
    }

    const { body, params, query, file } = result.data;

    if (body !== undefined) {
      req.body = body;
    }

    if (params !== undefined) {
      req.params = params;
    }

    if (query !== undefined) {
      req.query = query;
    }

    if (file !== undefined) {
      req.file = file;
    }

    req.validated = result.data;

    return next();
  };
}

module.exports = validate;
