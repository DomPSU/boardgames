const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const { PORT } = require("./constants");
const { getURL } = require("./utils");
const handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});
const createError = require("http-errors");

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine);

app.use(bodyParser.json());

app.use("/", router);

// catch 404
app.use((req, res, next) => {
  next(createError(404, "Not found."));
});

// error handler
app.use((err, req, res, next) => {
  err.status = err.status ? err.status : 500;
  err.message = err.message ? err.message : "Server error";
  res.status(err.status);

  console.log(`${err.status} : ${err.message}`);

  if (res.status === "500") {
    res.render("general", { text: err.status + " " + err.message });
  } else {
    res.json({ Error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${getURL()}...`);
});
