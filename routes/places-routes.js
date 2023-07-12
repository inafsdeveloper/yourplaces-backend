const express = require('express');

const router = express.Router();


const DUMMY_PLACES = require('../shared/data/places.json');

router.get('/:pid', (req, res, next) => {
    console.log('GET Request in Places');
    //   console.log(req);
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId);
    res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
    console.log('GET Request in Places for user');

    const userId = req.params.uid;

    const places = DUMMY_PLACES.find(p =>  {
        return p.creator === userId});
    console
    res.json({places});
});

module.exports = router;