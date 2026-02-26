import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

interface AuthenticateTokenRequest extends Request {
  user: {
    id: string;
  };
}

const authenticateToken = (
  req: AuthenticateTokenRequest,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken)
    return res.status(401).json({ message: "Access token is missing" });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid access token." });
  }
};

module.exports = authenticateToken;
export {};
