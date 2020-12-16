const express = require('express');
const app = express();

const productsRoutes = require('./api/products/products');
const ordersRouter = require('./api/products/orders');

app.use('/products', productsRoutes);
app.use('/orders', ordersRouter);

module.exports = app;