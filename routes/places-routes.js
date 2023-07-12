const express = require('express');
const { check } = require('express-validator')
const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post(
    '/',
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