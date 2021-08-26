const request = require("request");

const weatherStackApiKey = process.env.WEATHERSTACK_APIKEY;
const weatherStackBaseUrl = "http://api.weatherstack.com";

const forecast = (latitude, longitude, cb) => {
  const urlWeatherStackApi = `${weatherStackBaseUrl}/current?access_key=${weatherStackApiKey}&query=${latitude},${longitude}`;

  request({ url: urlWeatherStackApi, json: true }, (error, response) => {
    if (error)
      return cb(new Error("Unable to connect to the weather service"), null);

    if (response.body.error)
      return cb(new Error("Unable to find weather"), null);

    const {
      weather_descriptions,
      feelslike,
      temperature,
      precip,
      humidity,
      wind_speed,
      wind_dir,
      weather_icons,
    } = response.body.current;

    const { country } = response.body.location;

    cb(null, {
      temperature,
      feelslike,
      precip,
      humidity,
      wind_speed,
      wind_dir,
      country,
      forecast: weather_descriptions[0],
      imageDescriptionSrc: weather_icons[0],
    });
  });
};

module.exports = forecast;
