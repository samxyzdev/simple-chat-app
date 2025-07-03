import { WebSocket } from "ws";

class UserSession {
  userId: string;
  ws: WebSocket;
  rooms: Set<string>;

  constructor(userId: string, ws: WebSocket) {
    this.userId = userId;
    this.ws = ws;
    this.rooms = new Set();
  }

  joinRoom(roomId: string) {
    this.rooms.add(roomId);
  }

  leaveRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  send(data: any) {
    this.ws.send(JSON.stringify(data));
  }
}

class Room {
  roomId: string;
  users: Set<UserSession>;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.users = new Set();
  }

  addUser(user: UserSession) {
    this.users.add(user);
    user.joinRoom(this.roomId);
  }

  removeUser(user: UserSession) {
    this.users.delete(user);
    user.leaveRoom(this.roomId);
  }

  broadcast(senderId: string, message: string) {
    this.users.forEach((user) => {
      if (user.userId !== senderId) {
        user.send({ type: "chat", roomId: this.roomId, message });
      }
    });
  }
}

export class ChatManager {
  users: Map<string, UserSession>; // userId -> session
  rooms: Map<string, Room>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
  }

  addUser(userId: string, ws: WebSocket) {
    const user = new UserSession(userId, ws);
    this.users.set(userId, user);
    return user;
  }

  removeUser(userId: string) {
    const user = this.users.get(userId);
    if (!user) return;

    user.rooms.forEach((roomId) => {
      const room = this.rooms.get(roomId);
      room?.removeUser(user);
    });

    this.users.delete(userId);
  }

  getOrCreateRoom(roomId: string): Room {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Room(roomId));
    }
    return this.rooms.get(roomId)!;
  }

  joinRoom(userId: string, roomId: string) {
    const user = this.users.get(userId);
    if (!user) return;
    const room = this.getOrCreateRoom(roomId);
    room.addUser(user);
  }

  leaveRoom(userId: string, roomId: string) {
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);
    if (user && room) {
      room.removeUser(user);
    }
  }

  broadcastMessage(userId: string, roomId: string, message: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.broadcast(userId, message);
    }
  }
}
