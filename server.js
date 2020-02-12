const express = require('express'); // importing a CommonJS module
const morgan = require('morgan');
const helmet = require('helmet');


const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// global middleware
server.use(express.json()); // Built in middleware
// server.use(morgan('dev')); // Third party middleware
server.use(helmet()); // Security middleware
server.use(logger);
server.use(gatekeeper);

// Route and Endpoints
server.use('/api/hubs', gatekeeper, hubsRouter);

server.get('/', logger, greeter, (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${req.cohort} to the Lambda Hubs API</p>
    `);
});

module.exports = server;

function greeter(req, res, next) {
  req.cohort = ' Web 26';
  next();
}

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl} `)
  next();
}

function gatekeeper(req, res, next) {
  const password = req.headers.password
  if (password && password.toLowerCase() === 'mellon') {
    console.log('Success!');
    // res.status(200).json({message: 'Success!' });
    next();
  } else {
    res.status(401).json({ message: 'Password incorrect' });    
  }
}
