import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { ChatManager } from "./StateMangement.js";
import url from "url";

const wss = new WebSocketServer({ port: 8080 });

const manager = new ChatManager();

function checkUserAuthenticated(token: string, ws: WebSocket) {
  const isUserAuthenticated = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!isUserAuthenticated) {
    ws.close(400, "You jwt token not valid");
  }
  console.log("Inside the authenitcated");
  console.log(isUserAuthenticated);
  return isUserAuthenticated.userId;
  // user room id send krega jo backend ne generate krke usko send kri hai.
}

function checkRoomIdGeneratedFromServer(token: string, ws: WebSocket) {
  const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!decodedToken?.roomName) {
    ws.close(1008, "Room id is not generted from server");
    return;
  }
  console.log(decodedToken.roomName);
}

wss.on("connection", function connection(ws, req) {
  // token attach in the url from frontednd
  // @ts-ignore
  const token: string = url.parse(req.url, true).query.token;
  if (!token) {
    ws.close(400, "You are not authenticated");
    return;
  }
  const userId = checkUserAuthenticated(token, ws);
  console.log("User is authenticated");
  console.log(userId);
  ws.send("You are connected");
  const user = manager.addUser(userId, ws);
  ws.on("message", function message(data) {
    const parsed = JSON.parse(data.toString());
    console.log(parsed);

    switch (parsed.type) {
      case "join_room":
        // checkRoomIdGeneratedFromServer(parsed.serverSignedToken, ws);
        manager.joinRoom(userId, parsed.roomId);
        break;
      case "leave_room":
        manager.leaveRoom(userId, parsed.roomId);
        break;
      case "chat":
        // save chat in db
        manager.broadcastMessage(userId, parsed.roomId, parsed.message);
        break;
    }
  });

  ws.on("close", () => {
    manager.removeUser(userId);
  });
});

// If the server wants to close the connection (for example, user is not authorized):

// ts
// Copy
// Edit
// if (!userIsValid) {
//   ws.close(1008, "Unauthorized");
// }
