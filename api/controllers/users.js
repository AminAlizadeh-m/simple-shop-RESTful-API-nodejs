const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.users_login_user = (req, res, next) => {
    User.find( {email: req.body.email} )
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth faild'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        error: error
                    });
                }
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                if (result) {
                    return res.status(201).json({
                        message: 'Auth successfully',
                        token: token
                    });
                }

                res.status(401).json({
                    message: 'Auth faild'
                });
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

exports.users_signup_user = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hashedPassword
                        }).save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created'
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({
                                error: error
                            });
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}

exports.users_delete_user = (req, res, next) => {
    const userId = req.params.userId;
    User.remove( {_id: userId} )
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}