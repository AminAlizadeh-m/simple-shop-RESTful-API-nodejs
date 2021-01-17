const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', usersController.users_signup_user);

router.post('/login', usersController.users_login_user);

router.delete('/:userId', checkAuth, usersController.users_delete_user);

module.exports = router;