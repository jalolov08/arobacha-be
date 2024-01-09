const checkAuth = require("./checkAuth");

const optionalCheckAuth = (req, res, next) => {
  if (req.headers.authorization) {
    checkAuth(req, res, next);
  } else {
    next();
  }
};

module.exports = optionalCheckAuth;
