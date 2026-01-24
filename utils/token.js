const jwt = require("jsonwebtoken");

// Generate Access Token
function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" },
  );
}

// Generate Access Token
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
