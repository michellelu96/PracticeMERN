const notFound = (request, response, next) => {
  const error = new Error(`Not Found - ${request.originalUrl}`);
  response.status(404);
  next(error);
};

const errorHandler = (error, request, response, next) => {
  let statusCode = response.statusCode === 200 ? 500 : response.statusCode;
  let message = error.message;

  response.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
};

export { notFound, errorHandler };
