const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const config = require('./shared/config/config.json');

let dbConfig = config.db.mongodb;

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})

app.use('/api/places', placesRoutes); // => /api/places/...
app.use('/api/users', usersRoutes); // => /api/users/...

app.use((req, res, next) => {
    throw new HttpError('Could not found route.', 404);
});

app.use((error, req, res, next) => {
    // On Error if file exists, delete the file
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(`Unable the delete file. [${err}]`);
        });
    }

    if (req.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}` +
        `@cluster0.vpydxo1.mongodb.net/${process.env.DB_NAME}?` +
        `retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5500);
    })
    .catch(err => {
        console.log(err);
    });
