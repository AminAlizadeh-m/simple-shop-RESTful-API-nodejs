const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc.length > 0) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No entrise found'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Handling POST requset to /products',
            createdProduct: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propsName] = ops.propsValue;
    }
    Product.update({_id: id}, { $set: updateOps } )
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // Product.findByIdAndDelete(id)
    //     .exec()
    //     .then(doc => {
    //         res.status(200).json({
    //             message: 'Deleted' + doc
    //         });
    //     })
    //     .catch(error => {
    //         res.status(400).json({
    //             message: 'Error message'
    //         });
    //     });
    Product.remove({_id: id})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: result
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: error
            });
        });
});

module.exports = router;