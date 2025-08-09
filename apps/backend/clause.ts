const express = require("express");
const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// ================== USER ROUTES ==================

// Register new user
router.post("/users/register", async (req, res) => {
  try {
    const { email, password, name, profilePic } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profilePic,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePic: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login user
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get user profile
router.get("/users/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        profilePic: true,
        rooms: {
          include: {
            ChatRoom: {
              select: {
                id: true,
                roomName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put("/users/profile", authenticateToken, async (req, res) => {
  try {
    const { name, profilePic } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, profilePic },
      select: {
        id: true,
        email: true,
        name: true,
        profilePic: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ================== CHAT ROOM ROUTES ==================

// Create new chat room
router.post("/rooms", authenticateToken, async (req, res) => {
  try {
    const { roomName } = req.body;

    // Check if room already exists
    const existingRoom = await prisma.chatRoom.findUnique({
      where: { roomName },
    });

    if (existingRoom) {
      return res.status(400).json({ error: "Room name already exists" });
    }

    // Create room and add creator as member
    const room = await prisma.chatRoom.create({
      data: {
        roomName,
        users: {
          create: {
            userId: req.user.userId,
          },
        },
      },
      include: {
        users: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Get all chat rooms for user
router.get("/rooms", authenticateToken, async (req, res) => {
  try {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            userId: req.user.userId,
          },
        },
      },
      include: {
        users: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        _count: {
          select: {
            chats: true,
          },
        },
      },
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Get specific chat room
router.get("/rooms/:roomId", authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check if user is member of the room
    const userRoom = await prisma.userChatRoom.findFirst({
      where: {
        userId: req.user.userId,
        chatRoomId: roomId,
      },
    });

    if (!userRoom) {
      return res.status(403).json({ error: "Access denied" });
    }

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        users: {
          include: {
            User: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        chats: {
          orderBy: {
            createdAt: "asc",
          },
          take: 50, // Limit to last 50 messages
        },
      },
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// Join chat room
router.post("/rooms/:roomId/join", authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    // Check if room exists
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if user is already a member
    const existingMember = await prisma.userChatRoom.findFirst({
      where: {
        userId: req.user.userId,
        chatRoomId: roomId,
      },
    });

    if (existingMember) {
      return res.status(400).json({ error: "Already a member of this room" });
    }

    // Add user to room
    const userRoom = await prisma.userChatRoom.create({
      data: {
        userId: req.user.userId,
        chatRoomId: roomId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        ChatRoom: {
          select: {
            id: true,
            roomName: true,
          },
        },
      },
    });

    res.status(201).json(userRoom);
  } catch (error) {
    res.status(500).json({ error: "Failed to join room" });
  }
});

// Leave chat room
router.delete("/rooms/:roomId/leave", authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    const userRoom = await prisma.userChatRoom.findFirst({
      where: {
        userId: req.user.userId,
        chatRoomId: roomId,
      },
    });

    if (!userRoom) {
      return res.status(404).json({ error: "Not a member of this room" });
    }

    await prisma.userChatRoom.delete({
      where: {
        id: userRoom.id,
      },
    });

    res.json({ message: "Left room successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave room" });
  }
});

// ================== CHAT ROUTES ==================

// Send message
router.post("/rooms/:roomId/messages", authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message } = req.body;

    // Check if user is member of the room
    const userRoom = await prisma.userChatRoom.findFirst({
      where: {
        userId: req.user.userId,
        chatRoomId: roomId,
      },
    });

    if (!userRoom) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await prisma.chat.create({
      data: {
        message,
        chatRoomId: roomId,
      },
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get messages for a room
router.get("/rooms/:roomId/messages", authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is member of the room
    const userRoom = await prisma.userChatRoom.findFirst({
      where: {
        userId: req.user.userId,
        chatRoomId: roomId,
      },
    });

    if (!userRoom) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.chat.findMany({
      where: {
        chatRoomId: roomId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    res.json(messages.reverse()); // Reverse to get chronological order
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Update message
router.put("/messages/:messageId", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    // For now, allowing anyone to update any message
    // In production, you might want to add sender verification
    const updatedMessage = await prisma.chat.update({
      where: { id: messageId },
      data: { message },
    });

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

// Delete message
router.delete("/messages/:messageId", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    // For now, allowing anyone to delete any message
    // In production, you might want to add sender verification
    await prisma.chat.delete({
      where: { id: messageId },
    });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// ================== SEARCH ROUTES ==================

// Search rooms
router.get("/search/rooms", authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query required" });
    }

    const rooms = await prisma.chatRoom.findMany({
      where: {
        roomName: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// ================== ERROR HANDLING ==================

// Global error handler
router.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

// Handle Prisma disconnect on app termination
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = router;
