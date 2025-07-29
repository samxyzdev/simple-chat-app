import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  // console.log("In thi auth middleware");
  // console.log(token);
  if (!token) {
    res.status(400).json({
      msg: "Please relogin",
    });
    return;
  }
  try {
    const isTokenCorrect = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // console.log(isTokenCorrect);
    req.id = isTokenCorrect.userId;
    next();
  } catch (error) {
    res.status(401).json({
      msg: "token is not correct",
    });
    return;
  }
};
