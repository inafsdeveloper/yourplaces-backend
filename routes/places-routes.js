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

module.exports = router;