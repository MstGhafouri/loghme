const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = ` معتبر نیست ${err.path}: ${err.value} مقدار`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue)[0];
  const message = `فیلد (${value}) تکراری است`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(er => er.message);
  const message = errors.join('. ');
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('توکن شما معتبر نیست، لطفا دوباره وارد سایت شوید', 401);

const handleTokenExpiredError = () =>
  new AppError('توکن شما منقضی شده است، لطفا دوباره وارد سایت شوید', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // OPERATIONAL ERRORS, WE TRUST
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // UNKNOWN ERRORS, DON'T LEAK ERROR DETAILS
  // eslint-disable-next-line no-console
  console.error('ERROR 🧨 ', err);
  res.status(500).json({
    status: 'error',
    message: 'خطایی غیر منتظره رخ داده است'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    else if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    else if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError();
    else if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError();

    sendErrorProd(error, res);
  }
};
