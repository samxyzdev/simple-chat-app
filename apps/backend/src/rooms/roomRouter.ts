import { prisma } from "@repo/db/prisma";
import { randomUUIDv7 } from "bun";
import expres from "express";
import { authMiddleware } from "../middleware.js";

export const roomRouter = expres.Router();

roomRouter.post("/", authMiddleware, async (req, res) => {
  const uniqueRoomId = randomUUIDv7();
  const roomName = req.body.roomName;
  // const serverSignedToken = jwt.sign({ uniqueRoomId }, JWT_SECRET);
  const roomNameRegex = /^(?!.*\s{2,})[A-Za-z][A-Za-z\d ]*$/;
  if (!roomNameRegex.test(roomName)) {
    res.status(400).json({
      msg: "provide valid room name (must contain letters, numbers, and no double spaces)",
    });
    return;
  }

  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        uniqueRoomId,
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
      uniqueRoomId,
      // serverSignedToken,
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
        chatRoom: {
          include: {
            chats: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
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

roomRouter.post("/:uniqueRoomId/members", authMiddleware, async (req, res) => {
  const uniqueRoomId = req.params.uniqueRoomId;
  try {
    await prisma.userChatRoom.create({
      data: {
        chatRoom: { connect: { uniqueRoomId } },
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

roomRouter.post("/:uniqueRoomId/chats", authMiddleware, async (req, res) => {
  const userId = req.id;
  const uniqueRoomId = req.params.uniqueRoomId; // assuming you're passing room name
  const message = req.body.message;
  if (message === "") {
    res.status(400).json({ message: "receive empty string" });
    return;
  }
  try {
    await prisma.chat.create({
      data: {
        message,
        chatRoom: { connect: { uniqueRoomId } },
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

roomRouter.get("/:uniqueRoomId/chats", authMiddleware, async (req, res) => {
  // const userId = req.id;
  const uniqueRoomId = req.params.uniqueRoomId;
  try {
    const getAllThechats = await prisma.chat.findMany({
      where: {
        chatRoom: {
          uniqueRoomId,
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

roomRouter.delete("/:uniqueRoomId", authMiddleware, async (req, res) => {
  const uniqueRoomId = req.params.uniqueRoomId;
  try {
    await prisma.userChatRoom.deleteMany({
      where: { chatRoom: { uniqueRoomId } },
    });
    await prisma.chat.deleteMany({
      where: {
        chatRoom: { uniqueRoomId },
      },
    });
    await prisma.chatRoom.delete({
      where: { uniqueRoomId },
    });
    res.status(200).json({});
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: "something went wrong",
    });
  }
});
