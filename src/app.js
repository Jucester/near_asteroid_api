const express = require('express');
const morgan = require('morgan');

const app = express();

// Settings
app.set('PORT', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// Routes
app.get('/', (req, res) => {
    res.send('Hi');
})

// Error handler


module.exports = app;