const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log("Inside authenticateToken req.cookies: ", req.cookies);
  console.log("Inside authenticateToken Headers: ", req.headers.cookie);

  if (!accessToken)
    return res.status(401).json({ message: "Access token is missing" });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid access token." });
  }
};

module.exports = authenticateToken;
