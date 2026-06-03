module.exports = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;

  const responseBody = {
    success: false,
    error: {
      message: error.message || 'Internal Server Error',
      details: error.details || null,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    responseBody.error.stack = error.stack;
  }

  return response.status(statusCode).json(responseBody);
};
