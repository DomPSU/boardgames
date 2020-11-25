const express = require("express");

const router = express.Router();
const usersRouter = require("./usersRouter");
const boardgamesRouter = require("./boardgamesRouter");
const playsRouter = require("./playsRouter");

const middleware = require("../middlewares/auth");
const usersService = require("../services/usersService");

router.get("/", function (req, res) {
  res.status(200);
  res.render("home");
});

router.get("/login", function (req, res) {
  res.status(200);
  res.render("login");
});

router.use("/users", usersRouter);
router.use("/boardgames", boardgamesRouter);
router.use("/plays", playsRouter);

module.exports = router;
