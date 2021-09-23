const express = require("express");
const logger = require("morgan");
const hbs = require("hbs");

const path = require("path");

const geocode = require("./utils/geocode");
const forcast = require("./utils/forecast");
const imagePlace = require("./utils/imagePlace");

const app = express();

const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

app.use(logger("dev"));

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.render("index", { title: "Weather", name: "Yomar Gutierrez" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About me", name: "Yomar Gutierrez" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Yomar Gutierrez",
    helpText: "This the articles help page",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Yomar Gutierrez",
    errorMessage: "Help article not found",
  });
});

app.get("/weather", (req, res) => {
  const { address } = req.query;

  geocode(address, (err, geoData) => {
    if (err) {
      res.status(400).send({ error: err.message });
      return;
    }

    const { location, longitude, latitude } = geoData;

    forcast(latitude, longitude, (err, forecastData) => {
      if (err) {
        res.status(400).send({ error: err.message });
        return;
      }

      imagePlace(location, (err, { photoUrl }) => {
        if (err) {
          res.status(400).send({ error: err.message });
          return;
        }

        res.status(200).send({
          error: null,
          forecastData: {
            ...forecastData,
            city: location,
            cityImgSrc: photoUrl,
          },
        });
      });
    });
  });
});

app.get("/products", (req, res) => {
  const { search } = req.query;

  if (!search) {
    res.status(400).send({ error: "You must provide a search term" });
    return;
  }

  res.send({ products: [search] });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Yomar Gutierrez",
    errorMessage: "Page Not Found",
  });
});

app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});
