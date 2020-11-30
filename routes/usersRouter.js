const express = require("express");
const usersController = require("../controllers/usersController");
const {
  methodNotAllowed,
  onlyReturnsJSON,
} = require("../middlewares/generalMiddleware");
const usersRouter = express.Router();

usersRouter.use(onlyReturnsJSON);

// get
usersRouter.get("/:userID", usersController.show);
usersRouter.get("/", usersController.index);

// post
usersRouter.post("/:userID", methodNotAllowed);
usersRouter.post("/", usersController.create);

// put
usersRouter.put("/:userID", methodNotAllowed);
usersRouter.put("/", methodNotAllowed);

// patch
usersRouter.patch("/:userID", methodNotAllowed);
usersRouter.patch("/", methodNotAllowed);

// delete
usersRouter.delete("/:userID", methodNotAllowed);
usersRouter.delete("/", methodNotAllowed);

module.exports = usersRouter;
