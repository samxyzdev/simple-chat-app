import expres from "express";
import { authMiddleware } from "../middleware.js";
import { ChatSchema } from "@repo/zod/zodSchema";
import { prisma } from "@repo/db/prisma";
import { connect, randomUUIDv7 } from "bun";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const roomId = expres.Router();

// generate a random room Id
roomId.get("/generate-room-id", authMiddleware, async (req, res) => {
  //   const userData = ChatSchema.safeParse(req.body);
  console.log("IN genera room id");
  console.log(req.id);
  const roomName = randomUUIDv7();
  const serverSignedToken = jwt.sign({ roomName }, JWT_SECRET);
  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        roomName,
      },
    });
    console.log(chatRoom);
    await prisma.userChatRoom.create({
      data: {
        userId: req.id,
        chatRoomId: chatRoom.id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error while saving the roomID in DB",
    });
  }

  if (!roomName) {
    res.status(400).json({
      msg: "please provide correct chat room details",
    });
    return;
  }

  res.status(200).json({
    roomName,
    serverSignedToken,
    msg: "Room Created Successfully",
  });
});

roomId.get("/get-room-id", authMiddleware, async (req, res) => {
  const userId = req.id;
  try {
    const allTheRoomName = await prisma.userChatRoom.findMany({
      where: {
        userId: userId,
      },
      include: {
        chatRoom: true,
      },
    });

    console.log(allTheRoomName);
    res.status(200).json({ allTheRoomName });
  } catch (error) {
    res.status(400).json({
      msg: "No room exist",
    });
  }
});
