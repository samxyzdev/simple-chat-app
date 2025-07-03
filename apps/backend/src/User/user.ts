import prisma from "@repo/db/prisma";
import { SigninSchema, SignupSchema } from "@repo/zod/zodSchema";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

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
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server error",
    });
  }

  res.status(201).json({
    msg: "User created successfully",
  });
  return;
});

userRouter.get("/signin", async (req, res) => {
  const userData = SigninSchema.safeParse(req.body);
  if (!userData.success) {
    res.status(400).json({
      msg: "Please provide correct details",
    });
    return;
  }
  const { email, password } = userData.data;
  const getPasswordOfUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (getPasswordOfUser === null) {
    res.status(200).json({
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
  try {
    const token = jwt.sign({ userId: getPasswordOfUser.id }, JWT_SECRET);
    res.status(200).json({
      token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
    });
    return;
  }
});
