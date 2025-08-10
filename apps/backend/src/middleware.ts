import { NextFunction, Request, Response } from "express";
import { signCookie } from "./lib/signCookie.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("middleware");
  console.log(req.cookies.userId);
  const [sessionId, signatureFromCookie, userId] = (
    req.cookies?.sid || ""
  ).split(".");
  if (!sessionId || !signatureFromCookie || !userId) {
    res.status(400).json({
      msg: "Please relogin",
    });
    return;
  }
  const signature = signCookie(sessionId).split(".")[1];
  if (signature !== signatureFromCookie) {
    res.status(400).json({
      msg: "Signed cookie didn't match",
    });
    return;
  }

  req.id = userId;
  req.sessionId = sessionId;
  next();

  // const token = req.headers.authorization;
  // console.log("In thi auth middleware");
  // console.log(token);

  // try {
  //   const isTokenCorrect = jwt.verify(token, JWT_SECRET) as JwtPayload;
  //   console.log(isTokenCorrect);
  //   req.id = isTokenCorrect.userId;
  //   req.id = sessionId.userId;
  //   next();
  // } catch (error) {
  //   res.status(401).json({
  //     msg: "token is not correct",
  //   });
  //   return;
  // }
};
