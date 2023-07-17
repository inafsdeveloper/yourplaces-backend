const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const secretKey = require('../shared/config/secret.json')['secret-key'];
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization // Bearer Token
        if (!token) {
            throw new HttpError('Authentication Failed!', 401);
        }

        const decodedToken = jwt.verify(token, secretKey);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        console.log(err);
        const error = new HttpError('Authentication Failed! [' + err + ']', 401);
        return next(error);
    }

}