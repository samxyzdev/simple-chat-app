import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(400).json({
      msg: "Please relogin",
    });
    return;
  }
  try {
    const isTokenCorrect = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.id = isTokenCorrect.id;
    next();
  } catch (error) {
    res.status(401).json({
      msg: "token is not correct",
    });
    return;
  }
};
