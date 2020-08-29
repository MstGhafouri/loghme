/* eslint-disable no-console */
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.error('Uncaught Exception 🧨🧨🧨: \n', err.name, err.message);
  console.error(err);
  process.exit(1);
});

dotenv.config({ path: path.join(__dirname, '../config.env') });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DataBase connection established ✔✔✔');
  });

const port = process.env.PORT || 3003;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection 🧨🧨🧨: \n', err.name, err.message);
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Heroku send every 24h SIGTERM to close the server
process.on('SIGTERM', () => {
  console.log('Sigterm signal received!. Shutting down gracefully!');
  server.close(() => {
    console.log('Process terminated gracefully !');
  });
});
