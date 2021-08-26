const request = require("request");

const unsplashApiKey = process.env.UNSPLASH_APIKEY;
const unsplashBaseUrl = "https://api.unsplash.com";

const imagePlace = (cityName, cb) => {
  if (!cityName) {
    cb(new Error("No term provided"), null);
  }
  const unsplashUrl = `${unsplashBaseUrl}/search/photos?query=${cityName}&client_id=${unsplashApiKey}`;

  request({ url: unsplashUrl, json: true }, (error, { body: { results } }) => {
    if (error)
      return cb(new Error("Unable to connect to photos service"), null);

    if (results.length === 0)
      return cb(new Error("Unable to find photos. Try another search"), null);

    //const randomIndex = Math.floor(Math.random() * results.length);
    const photoUrl = results[0].urls.small;

    cb(null, { photoUrl });
  });
};

module.exports = imagePlace;
