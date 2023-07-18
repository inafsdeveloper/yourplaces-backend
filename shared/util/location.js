const axios = require('axios');

const HttpError = require('../../models/http-error');

const API_KEY = 'AIzaSyA3EAoLEltj-IflHu7tcbYUunPLDqaxnQg';

async function getCoordinatesForAddress(address) {

    const url = `${process.env.GOOGLE_ADDRESS_URL}=${encodeURIComponent(address)}` +
        `&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError(
            'Could not find the location for the specified address.'
            , 422);
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

module.exports = getCoordinatesForAddress;