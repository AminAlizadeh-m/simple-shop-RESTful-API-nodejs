const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRouter = require('./api/routes/user');

mongoose.connect('mongodb://' +
    process.env.MONGO_ADDRESS + ':' +
    process.env.MONGO_PORT + '/' +
    process.env.MONGO_DB_NAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json()); // Parse body as json

// CROS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE');
        res.status(200).json({});
    }

    next();
})

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;