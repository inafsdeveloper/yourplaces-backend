const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
let DUMMY_USERS = require('../shared/data/users.json');

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find( u => u.email === email);

    if(hasUser) {
        throw new HttpError('Could not create user, email already exists.', 422);
    }

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(newUser);

    res.status(201).json({message: 'New User has been signed Up!'});
};

const login = (req, res, next) => {
    const {email, password} = req.body;

    const user = DUMMY_USERS.find(user => user.email === email);

    if(!user || password !== user.password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }

   

    res.json({message: "Logged in!"});
    
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;