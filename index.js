const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const util = require("./util");
const session = require("express-session");
const handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars.engine);

app.use(bodyParser.json());
app.use(
  session({
    secret: "secret", // TODO add session secret
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", router);

app.use((req, res, next) => {
  console.log("500");
  res.status(500).end();
});

app.listen(util.PORT, () => {
  console.log(`Server listening on ${util.getURL()}...`);
});
