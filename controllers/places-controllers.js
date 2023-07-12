const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
let DUMMY_PLACES = require('../shared/data/places.json');

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place }); // => { place } => { place: place }
};


const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, imageUrl, description, address, coordinates, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    imageUrl,
    description,
    address,
    creator,
    location: coordinates
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({
    place: createdPlace
  });
}

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;

  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({place: updatedPlace});
  
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  // delete DUMMY_PLACES[placeIndex];
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.json({message : "Delted place."});
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;