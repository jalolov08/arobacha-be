const jwt = require("jsonwebtoken");
require("dotenv").config();

async function checkAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        msg: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      msg: "Нет доступа",
    });
  }
}

module.exports = checkAuth;
