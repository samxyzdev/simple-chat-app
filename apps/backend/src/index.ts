import express from "express";
import cors from "cors";
import { userRouter } from "./User/user.js";
import { generateRoomId } from "./RoomIdGenerator/room.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", generateRoomId);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
