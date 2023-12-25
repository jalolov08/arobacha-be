const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      about: user.about,
      photoUri: user.photoUri,
      follows: user.follows,
      followers: user.followers,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256"  , expiresIn:"1h"}
  );
}
function generateRefreshToken(user){
    return jwt.sign(
        {
          _id: user._id,
          username: user.username,
          },
        process.env.JWT_REFRESH_SECRET,
        { algorithm: "HS256"  , expiresIn:"90d"}
      );
}
module.exports = {
  generateToken,
  generateRefreshToken
};

