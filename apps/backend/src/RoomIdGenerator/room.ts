import { prisma } from "@repo/db/prisma";
import { randomUUIDv7 } from "bun";
import expres from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { authMiddleware } from "../middleware.js";

export const roomRouter = expres.Router();

roomRouter.post("/", authMiddleware, async (req, res) => {
  const roomName = randomUUIDv7();
  // const roomName = req.body.roomName;
  const serverSignedToken = jwt.sign({ roomName }, JWT_SECRET);
  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        roomName,
      },
    });
    await prisma.userChatRoom.create({
      data: {
        chatRoom: { connect: { id: chatRoom.id } },
        user: { connect: { id: req.id } },
      },
    });
    res.status(201).json({
      roomName,
      serverSignedToken,
      msg: "Room Created Successfully",
    });
    return;
  } catch (error) {
    res.status(400).json({
      msg: "Error while saving the roomID in DB",
    });
  }
});

roomRouter.get("/my", authMiddleware, async (req, res) => {
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

    // console.log(allTheRoomName);
    res.status(200).json({ allTheRoomName });
  } catch (error) {
    res.status(400).json({
      msg: "No room exist",
    });
  }
});

roomRouter.post("/:roomName/members", authMiddleware, async (req, res) => {
  const roomName = req.params.roomName;
  try {
    await prisma.userChatRoom.create({
      data: {
        chatRoom: { connect: { roomName } },
        user: { connect: { id: req.id } },
      },
    });
    res.status(200).json({
      msg: "user added in this room",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "error while adding the user in this room",
    });
  }
});

roomRouter.post("/:roomName/chats", authMiddleware, async (req, res) => {
  const userId = req.id;
  const roomName = req.params.roomName; // assuming you're passing room name
  const message = req.body.message;
  try {
    await prisma.chat.create({
      data: {
        message,
        chatRoom: { connect: { roomName: roomName } },
        user: { connect: { id: userId } },
      },
    });
    res.status(200).json({
      message: "message save in db",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "error while saving the message in db",
    });
  }
});

roomRouter.get("/:roomName/chats", authMiddleware, async (req, res) => {
  // const userId = req.id;
  const roomId = req.params.roomName;
  try {
    const getAllThechats = await prisma.chat.findMany({
      where: {
        chatRoom: {
          roomName: roomId,
        },
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });
    console.log(getAllThechats);

    res.status(200).json({ getAllThechats });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "NO CHAT FOUND FOR GIVE room",
    });
  }
});
