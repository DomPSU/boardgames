const express = require("express");
const usersController = require("../controllers/usersController");
const {
  methodNotAllowed,
  onlyReturnsJSON,
} = require("../middlewares/generalMiddleware");
const usersRouter = express.Router();

usersRouter.use(onlyReturnsJSON);

// get
usersRouter.get("/:id", usersController.show);
usersRouter.get("/", usersController.index);

// post
usersRouter.post("/:id", methodNotAllowed);
usersRouter.post("/", usersController.create);

// put
usersRouter.put("/:id", methodNotAllowed);
usersRouter.put("/", methodNotAllowed);

// patch
usersRouter.patch("/:id", methodNotAllowed);
usersRouter.patch("/", methodNotAllowed);

// delete
usersRouter.delete("/:id", methodNotAllowed);
usersRouter.delete("/", methodNotAllowed);

module.exports = usersRouter;
