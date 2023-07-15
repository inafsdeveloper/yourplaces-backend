const express = require('express');
const { check } = require('express-validator')
const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    [
        check('title').not().isEmpty().withMessage("Title is required."),
        check('description').isLength({ min: 5 }).withMessage("Description should be aleast 5 character long."),
        check('address').not().isEmpty().withMessage("Address is required.")
    ],
    placesControllers.createPlace);

router.patch('/:pid',
    [
        check('title').not().isEmpty().withMessage("Title is required."),
        check('description').isLength({ min: 5 }).withMessage("Description should be aleast 5 character long.")
    ],
    placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;