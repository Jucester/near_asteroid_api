const express = require('express');
const morgan = require('morgan');

const app = express();

// Importing Routes
const userRoutes = require('./routes/user.routes');

// Settings
app.set('PORT', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// Routes
app.use('/api/1.0/users', userRoutes);

// Error handler


module.exports = app;