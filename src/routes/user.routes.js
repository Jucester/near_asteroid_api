const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { getUsers, register, login, oauthLogin, oauthLoginCallback } = require('../controllers/users.controller');
const auth = require('../middlewares/auth');



router.get('/login/github', oauthLogin)

router.get('/login/github/callback', oauthLoginCallback);

router.post('/register', [
        check('username').notEmpty().withMessage('Username is required'),
        check('email').notEmpty().withMessage('Email is required'),
        check('password').notEmpty().withMessage('Password is required')
    ],
    register
);

router.post('/login', login);

router.get('/', auth, getUsers);

module.exports = router;