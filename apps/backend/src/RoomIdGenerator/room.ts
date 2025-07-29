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
  const randomUUIDv7RoomName = randomUUIDv7();
  const serverSignedToken = jwt.sign({ randomUUIDv7RoomName }, JWT_SECRET);
  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        roomName: randomUUIDv7RoomName,
      },
    });
    await prisma.userChatRoom.create({
      data: {
        chatRoom: { connect: { id: chatRoom.id } },
        user: { connect: { id: req.id } },
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      msg: "Error while saving the roomID in DB",
    });
  }
  // if (!randomUUIDv7RoomName) {
  //   res.status(400).json({
  //     msg: "please provide correct chat room details",
  //   });
  //   return;
  // }
  res.status(200).json({
    randomUUIDv7RoomName,
    serverSignedToken,
    msg: "Room Created Successfully",
  });
  return;
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

    // console.log(allTheRoomName);
    res.status(200).json({ allTheRoomName });
  } catch (error) {
    res.status(400).json({
      msg: "No room exist",
    });
  }
});

roomId.post("/save-room-id", authMiddleware, async (req,res) => {
  const chatRoomId = req.body.chatRoomId
  try {
     const saveRoomId = await prisma.userChatRoom.create({
      data: {
        chatRoom: { connect: { roomName: chatRoomId} },
        user: { connect: { id: req.id } },
      },
    });
    res.status(200).json({
      msg:"Join Room Id savein DB"
    })
  } catch (error) {
  console.log(error);
  
       res.status(400).json({
      msg: "Error while saving the joinRoomId in DB",
    });
  }
 
})

roomId.post("/save-chat", authMiddleware, async (req, res) => {
  const userId = req.id;
  const roomName = req.body.roomId; // assuming you're passing room name
  const roomMessage = req.body.roomMessage;
  try {
    await prisma.chat.create({
      data: {
        message: roomMessage,
        chatRoom: { connect: { roomName: roomName } },
        user: { connect: { id: userId } },
      },
    });
    res.status(200).json({
      msg: "msg saved in DB",
    });             
    return;
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error while saving the message in DB",
    });
  }
});

roomId.post("/chats", authMiddleware, async (req, res) => {
  // const userId = req.id;
  const roomId = req.body.roomId;
  try {
    const getAllThechats = await prisma.chat.findMany({
      where: {
         chatRoom: {
          roomName: roomId
         }
      },
      include: {
        user: true,
      },
    });
    console.log(getAllThechats);
    
    res.status(200).json({ getAllThechats });
    return;
  } catch (error) {
    console.log(error)
    res.status(400).json({
      msg: "NO CHAT FOUND FOR GIVE room",
    });
  }
});
