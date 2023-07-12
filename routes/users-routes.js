const express = require('express');
const { check } = require('express-validator')
const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/signup',
    [
        check('name').not().isEmpty().withMessage("Name is required."),
        check('email').isEmail().withMessage("Email Address is not valid!"),
        check('password').not().isEmpty().withMessage("Password is required.")
        .isLength({min: 6}).withMessage("Password should be atleast 6 characters")
    ],
    usersControllers.signup);

router.post('/login',
    [
        check('email').isEmail().withMessage("Email Address is not valid!"),
        check('password').not().isEmpty().withMessage("Password is required.")
    ],
    usersControllers.login);

module.exports = router;