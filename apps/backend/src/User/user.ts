import prisma from "@repo/db/prisma";
import { SigninSchema, SignupSchema } from "@repo/zod/zodSchema";
import bcrypt from "bcryptjs";
import express from "express";
import { signCookie } from "../lib/signCookie.js";
import { authMiddleware } from "../middleware.js";

export const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const userData = SignupSchema.safeParse(req.body);
  if (!userData.success) {
    res.status(400).json({
      msg: "Please Provide Correcte data",
    });
    return;
  }
  const { name, email, password } = userData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });
    res.status(201).json({
      message: "Signup successfully",
      user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const userData = SigninSchema.safeParse(req.body);
  if (!userData.success) {
    res.status(400).json({
      msg: "Please provide correct details",
    });
    return;
  }
  const { email, password } = userData.data;
  try {
    const getPasswordOfUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (getPasswordOfUser === null) {
      res.status(400).json({
        msg: "No user found in the DB",
      });
      return;
    }
    const hashedPassword = getPasswordOfUser.password;
    const checkPassword = await bcrypt.compare(password, hashedPassword);
    if (!checkPassword) {
      res.status(400).json({
        msg: "Incorrect Password",
      });
      return;
    }
    const session = await prisma.session.create({
      data: {
        userId: getPasswordOfUser.id,
      },
    });
    res.cookie("sid", signCookie(session.id, getPasswordOfUser.id), {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).send("Cookie has been set!");
    return;
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
    });
    return;
  }
});

userRouter.post("/signout", authMiddleware, async (req, res) => {
  const sessionId = req.sessionId;
  if (!sessionId) {
    return;
  }
  await prisma.session.deleteMany({
    where: {
      userId: sessionId,
    },
  });
  res.cookie("", "");
  res.status(204).json({});
  return;
});

userRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.id,
      },
      omit: {
        password: true,
      },
    });
    res.status(200).json({
      user,
    });
    return;
  } catch (error) {
    res.status(400).json({
      msg: "No user found",
    });
  }
});
