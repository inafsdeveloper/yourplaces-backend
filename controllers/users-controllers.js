const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const User = require('../models/user');
let DUMMY_USERS = require('../shared/data/users.json');

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch(err) {
        const error = new HttpError(`Unable to find users, please try again later.\n Details \n [${err}]`, 500);
        return next(error);
    }


    res.json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, email, password } = req.body;


    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch(err) {
        const error = new HttpError(`Signing Up failed, please try again later.\n Details \n [${err}]`, 500);
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError('User exist already, please login instead.', 422);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://clipart-library.com/newhp/kissclipart-computer-geek-cartoon-clipart-geek-nerd-clip-art-d978f3a27174b0f9.png',
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError(`Signing Up failed, please try again later.\n Details \n [${err}]`, 500);
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch(err) {
        const error = new HttpError(`Logging in failed, please try again later.\n Details \n [${err}]`, 500);
        return next(error);
    }

    

    if (!existingUser || password !== existingUser.password) {
        return next(new HttpError('Could not identify user, credentials seem to be wrong.', 401));
    }

    res.json({ message: "Logged in!" });

};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;