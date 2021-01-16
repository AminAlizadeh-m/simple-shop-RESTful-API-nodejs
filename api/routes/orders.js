const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
    Order.find().select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        ...doc._doc,
                        request: {
                            type: 'GET',
                            url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/orders/${doc._id}`
                        }   
                    }
                })
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        
        return order.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Order was created',
            createdOrder: {
                ...result._doc
            },
            request: {
                type: 'GET',
                url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/orders/${result._id}`
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
                request:{
                    type: 'GET',
                    url:`${process.env.URL_SERVER}:${process.env.PORT_SERVER}/orders`
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.remove( { _id: id } )
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                message: 'Order deleted',
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

module.exports = router;