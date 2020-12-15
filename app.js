const express = require('express');
const app = express();

// Add a midleware
app.use( (req, res, next) => {
    res.status(200).json({
        message: 'Welcome to my server'
    });
});

module.exports = app;