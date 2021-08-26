const request = require("request");

const mapBoxAccessToken = process.env.MAPBOX_ACCESSTOKEN;
const mapBoxBaseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places";

const geocode = (address, cb) => {
  if (!address) {
    return cb(new Error("You need to provide a valid address"), null);
  }

  const geocodeUrl = `${mapBoxBaseUrl}/${address}.json?access_token=${mapBoxAccessToken}`;

  request({ url: geocodeUrl, json: true }, (error, response) => {
    if (error)
      return cb(new Error("Unable to connect to the location service"), null);

    if (response.body.features.length === 0)
      return cb(new Error("Unable to find location. Try another search"), null);

    const {
      center: [longitude, latitude],
      text,
    } = response.body.features[0];

    cb(null, { location: text, longitude, latitude });
  });
};

module.exports = geocode;
