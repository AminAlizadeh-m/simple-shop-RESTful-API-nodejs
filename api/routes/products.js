const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5MB
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _Wid productImage')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            ...doc._doc,
                            request: {
                                type: 'GET',
                                url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/products/${doc._id}`
                            }
                        };
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'No entrise found'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(req.file.path);
        res.status(200).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                productImage: req.file.path,
                requset: {
                    type: 'POST',
                    url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/products/${result._id}`
                }
            }
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/products/${doc._id}`
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(error => {
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
    Product.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: 'PATCH',
                    url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/products/${id}`
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'DELETE',
                    url: `${process.env.URL_SERVER}:${process.env.PORT_SERVER}/products/${id}`
                }
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