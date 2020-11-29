const createError = require("http-errors");

const isReqBodyEmpty = async (req, res, next) => {
  const sentKeys = Object.keys(req.body);

  if (sentKeys.length !== 0) {
    return next(createError(400, "Request body must be empty for this route."));
  }

  next();
};

const methodNotAllowed = async (req, res, next) => {
  return next(createError(405, "Method not allowed."));
};

const onlyReturnsJSON = async (req, res, next) => {
  if (!req.accepts("json")) {
    return next(createError(406, "Not Acceptable. JSON is returned."))
  }

  next();
}

module.exports = {
  isReqBodyEmpty,
  methodNotAllowed,
  onlyReturnsJSON,
};
