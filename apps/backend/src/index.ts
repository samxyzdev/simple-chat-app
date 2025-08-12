import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { roomRouter } from "./rooms/roomRouter.js";
import { userRouter } from "./users/userRouter.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true, // allow cookies / auth headers
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/rooms", roomRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
