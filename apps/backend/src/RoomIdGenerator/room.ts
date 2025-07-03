import expres from "express";
import { authMiddleware } from "../middleware.js";
import { ChatSchema } from "@repo/zod/zodSchema";
import { prisma } from "@repo/db/prisma";
import { randomUUIDv7 } from "bun";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const generateRoomId = expres.Router();

// generate a random room Id
generateRoomId.get("/generate-room-id", authMiddleware, async (req, res) => {
  //   const userData = ChatSchema.safeParse(req.body);
  const roomId = randomUUIDv7();
  const serverSignedToken = jwt.sign({ roomId }, JWT_SECRET);
  if (!roomId) {
    res.status(400).json({
      msg: "please provide correct chat room details",
    });
    return;
  }
  // this logic should be run in ws
  // await prisma.chatRoom.create({
  //   data: {
  //     roomName,
  //   },
  // });
  res.status(401).json({
    roomId,
    serverSignedToken,
    msg: "Room Created Successfully",
  });
});

// when creating a room what should i send
// 1. Store room in db
// 2. Send token for ws server to verify
// 3.

// I have to write message storing logic in webscoket

// {
//     "roomName": "0197cecd-ef21-7000-89ee-0675684322eb",
//     "msg": "Room Created Successfully"
// }
