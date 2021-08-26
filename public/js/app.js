const weatherForm = document.querySelector("form");
const weatherContainer = document.querySelector(".weather-container");
const loaders = document.getElementById("content-loaders");
const errorMessage = document.getElementById("error-message");
const searchInput = document.querySelector("input");

searchInput.addEventListener("focusin", () => {
  errorMessage.style.display = "none";
});

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();

  weatherContainer.style.display = "none";
  loaders.style.display = "grid";
  errorMessage.style.display = "none";

  const location = searchInput.value;

  fetch(`http://localhost:3000/weather?address=${location}`)
    .then((res) => res.json())
    .then(({ error, forecastData }) => {
      if (error) throw new Error(error);
      loaders.style.display = "none";
      weatherContainer.style.display = "grid";
      displayWeatherData(forecastData);
    })
    .catch((error) => {
      errorMessage.style.display = "block";
      errorMessage.textContent = error.message;
      loaders.style.display = "none";
      weatherContainer.style.display = "none";
    });
});

const displayWeatherData = (forecastData) => {
  const {
    city,
    country,
    imageDescriptionSrc,
    temperature,
    precip,
    humidity,
    wind_speed,
    wind_dir,
    cityImgSrc,
  } = forecastData;

  const locationTitle = document.getElementById("forecast-city");
  locationTitle.textContent = `${city}, ${country}`;

  const imageDescriptions = document.getElementById("forecast-image");
  imageDescriptions.src = imageDescriptionSrc;

  const temp = document.getElementById("temperature");
  temp.textContent = temperature;

  const precipitationItem = document.getElementById("precipitation");
  precipitationItem.textContent = `Precipitation: ${precip}mm`;

  const humidityItem = document.getElementById("humidity");
  humidityItem.textContent = `Humidity: ${humidity}%`;

  const windItem = document.getElementById("wind");
  windItem.textContent = `Wind: ${wind_speed}km/h ${wind_dir}`;

  const cityImage = document.getElementById("city-image");
  cityImage.src = cityImgSrc;
};
