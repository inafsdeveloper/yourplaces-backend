const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const getCoordinatesForAddress = require('../shared/util/location');
const Place = require('../models/place');
let DUMMY_PLACES = require('../shared/data/places.json');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(`Something went wrong, could not find a place. \nDetails:\n[${err}]`, 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
};


const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;

  try {
    places = await Place.find({creator : userId});
  } catch(err) {
    const error = new HttpError(`Fetching places failed. Please try again. \nDetails:\n[${err}]`, 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ places : places.map(place => place.toObject({getters: true})) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, image, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image,
    address,
    location: coordinates,
    creator
  });

  try {
    await createdPlace.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(`Creating place failed.Please try again. \nDetails:\n[${err}]`, 500);
    next(error);
  }


  res.status(201).json({
    place: createdPlace
  });
}

const updatePlace = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;

  const placeId = req.params.pid;
  
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(`Something went wrong, could not find a place to update. Please try again. \nDetails:\n[${err}]`, 500);
    return next(error);
  }

  

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch(err) {
    const error = new HttpError(`Something went wrong, could not update the place. Please try again. \nDetails:\n[${err}]`, 500);
    return next(error);
  }


  res.status(200).json({ place: place.toObject({getters: true}) });

};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findByIdAndDelete(placeId)
  } catch (err) {
    const error = new HttpError(`Something went wrong, could not find a place to delete. Please try again. \nDetails:\n[${err}]`, 500);
    return next(error);
  }

  res.json({ message: "Deleted place." });
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;