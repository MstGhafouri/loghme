const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const restaurantRouter = require('./routes/restaurantRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();
// Enable trust proxy for heroku headers
app.enable('trust proxy');
// 1) MIDDLEWARES
// Enable cross-origin requests
app.use(cors());
// For none-simple requests such as put, patch, delete or also
// requests which send cookies or use none-standard headers, they require a preflight phase!
// Browsers send options request to check if is safe to send actual request!  ):
// So we need to send  Access Control Origin Header !
app.options('*', cors());
// Set secure headers, except CSP!
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
// Limit requests from the same IP to protect against attacks ( brute force !)
const limiter = rateLimit({
  max: 100, // Max api request
  windowMs: 60 * 60 * 1000, // Per one hour,
  message: {
    status: 'fail',
    message: 'Too many requests from the this IP. Please try again in an hour!'
  }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // FOR PARSING BODY CONTENT (LIKE POST BODY)
// Cookie parser, parse the cookie that browser sends
app.use(cookieParser());
// Form parser, reading data from form into req.body
// Only when we need to respond to form actions !
app.use(express.urlencoded({ extended: true, limit: '1kb' }));

// Data sanitization against NoSql query injections
app.use(mongoSanitize());
// Data sanitization against XSS ( Cross-site scripting attack !)
app.use(xss());
// Prevent parameter pollution (Http Parameter Pollution)
// Clear up query string
app.use(hpp());
// Compress responses!
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  // Development logger
  app.use(morgan('dev'));
}

// ROUTES HANDLERS
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

// Catch all unknown routes ( this middleware runs after all routes have been defined !)
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.resolve(__dirname, '../client', 'build')));

  app.get('*', (req, res, next) => {
    // Serve index.html file if it doesn't recognize the route
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Catch all unknown routes
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.method} ${req.originalUrl} on this server`,
      404
    )
  );
});
// Final middleware, Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
