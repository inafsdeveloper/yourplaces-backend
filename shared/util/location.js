const axios = require('axios');

const HttpError = require('../../models/http-error');

const API_KEY = 'AIzaSyA3EAoLEltj-IflHu7tcbYUunPLDqaxnQg';

async function getCoordinatesForAddress(address) {
    // return {
    //             lat: 40.7484405,
    //             lng: -73.9878584
    //         };

    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    const response = await axios.get(url);

    const data = response.data;

    if(!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError(
            'Could not find the location for the specified address.'
            , 422);
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

module.exports = getCoordinatesForAddress;