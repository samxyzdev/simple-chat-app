"use client";
import React, { useEffect, useRef, useState } from "react";
import { MenuIcon } from "../icons/MenuIcon";
import { NewchatIcon } from "../icons/NewchatIcon";
import { ChannelCard } from "./ChannelCard";
import { IconWrapper } from "./IconWrapeer";
import { SearchBar } from "./SearchBar";
import axios from "axios";
import { BACKEND_URL, WS_URL } from "../config";
import { useClickAway } from "@uidotdev/usehooks";
import { forwardRef } from "react";

export interface GenerateRoomId {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string;
  chatRoom: {
    id: string;
    roomName: string;
  };
}

export const Channelwindow = ({
  onSelectRoom,
  setSocket,
  socket,
}: {
  onSelectRoom: (room: GenerateRoomId) => void;
  setSocket: any;
  socket: any;
}) => {
  const [generateRoomId, setGenerateRoomId] = useState<GenerateRoomId[]>([]);
  const [recall, setRecall] = useState(false);
  const [showJoinRoomBox, setShowJoinRoomBox] = useState(false);
  const [chatRoomId, setChatRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const ref = useClickAway(() => {
    setShowJoinRoomBox(false);
  });

  // Establish WebSocket connection on component mount
  useEffect(() => {
    if (!token) {
      console.log("No token available");
      return;
    }
    console.log("Attempting to connect WebSocket...");
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);
    ws.onopen = () => {
      console.log("WebSocket connected successfully");
      setSocket(ws);
    };
    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      setSocket(null);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocket(null);
    };
    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [token]);

  // don't have to make this request becuase handleGenerateRoomId.
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${BACKEND_URL}/get-room-id`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        setGenerateRoomId(result.data.allTheRoomName || []);
      })
      .catch((err) => console.error("Error fetching room IDs", err));
  }, [recall, showJoinRoomBox]);
  // sending request to generate room Id

  const handleGenerateRoomId = async () => {
    if (!token) return;
    await axios.get(`${BACKEND_URL}/generate-room-id`, {
      headers: {
        Authorization: token,
      },
    });
    setRecall((prev) => !prev);
  };

  const handleRoom = (roomNameFromGeneratedRoom: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }
    setRoomName(roomNameFromGeneratedRoom);
    const data = JSON.stringify({
      type: "join_room",
      roomId: roomName,
    });
    socket.send(data);
    // Copying this logic in handleJoinRoom
    const clickedRoom = generateRoomId.find(
      (room) => room.chatRoom.roomName === roomName,
    );
    if (clickedRoom) {
      onSelectRoom(clickedRoom);
    }
  };

   const handleJoinRoom = async () => {
    console.log(chatRoomId)
    await axios.post(`${BACKEND_URL}/save-room-id`,{
      chatRoomId: chatRoomId
    }, {headers: {
      Authorization: token
    }})
    console.log("=== JOIN ROOM DEBUG ===");
    console.log("Chat Room ID:", chatRoomId);
    console.log("Socket state:", socket);
    console.log("Socket readyState:", socket?.readyState);
    console.log("WebSocket.OPEN constant:", WebSocket.OPEN);

    if (!socket) {
      console.error("Socket is null or undefined");
      alert("WebSocket connection not established. Please refresh the page.");
      return;
    }

    if (!chatRoomId || chatRoomId.trim() === "") {
      console.error("Room ID is empty");
      alert("Please enter a room ID");
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not open. Current state:", socket.readyState);
      alert("WebSocket connection not ready. Please try again in a moment.");
      return;
    }

    console.log("Sending join room message...");
    // save join romm in DB and redner it on screen.

    const data = JSON.stringify({
      type: "join_room",
      roomName: chatRoomId.trim(),
    });

    try {
      socket.send(data);
      console.log("Message sent successfully");
      setShowJoinRoomBox(false);
      setChatRoomId("");
      const clickedRoom = generateRoomId.find(
        (room) => room.chatRoom.roomName === roomName,
      );
      if (clickedRoom) {
        onSelectRoom(clickedRoom);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send join room message");
    }
  };

  return (
    <section className="w-full max-w-lg border-r border-gray-700 bg-[#161717]">
      <ChannelHeader />
      <div className="px-4">
        <SearchBar />
      </div>

      {/* Debug info - remove in production */}
      <div className="px-4 py-2 text-xs text-gray-400">
        WebSocket Status:{" "}
        {socket === null
          ? "Not connected"
          : socket.readyState === WebSocket.CONNECTING
            ? "Connecting..."
            : socket.readyState === WebSocket.OPEN
              ? "Connected"
              : socket.readyState === WebSocket.CLOSING
                ? "Closing..."
                : socket.readyState === WebSocket.CLOSED
                  ? "Closed"
                  : "Unknown"}
      </div>

      <div className="no-scrollbar max-h-[790px] overflow-y-auto p-3">
        {generateRoomId.length === 0 ? (
          <p className="text-center text-white">
            No chat rooms found. Create one!
          </p>
        ) : (
          generateRoomId.map((element, idx) => (
            <ChannelCard
              key={idx}
              name={
                element.chatRoom.roomName.split("-")[0]?.toString() ?? "Unknown"
              }
              lastMessage="?"
              time="10:23"
              chatRoomName={element.chatRoom.roomName}
              onClick={() => handleRoom(element.chatRoom.roomName)}
            />
          ))
        )}
        <div className="flex justify-center gap-3">
          <ButtonCreatingChatRoom onClick={handleGenerateRoomId} />
          <ButtonJoiningChatRoom
            onClick={() => setShowJoinRoomBox((prev) => !prev)}
          />
          {showJoinRoomBox && (
            <InputBoxForRoom
              ref={ref as React.RefObject<HTMLDivElement>}
              onClick={handleJoinRoom}
              setChatRoomId={setChatRoomId}
              chatRoomId={chatRoomId}
            />
          )}
        </div>
      </div>
    </section>
  );
};

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
      <div className="flex gap-4">
        <IconWrapper>
          <NewchatIcon />
        </IconWrapper>
        <IconWrapper>
          <MenuIcon />
        </IconWrapper>
      </div>
    </div>
  );
}

function ButtonCreatingChatRoom({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex h-[70px] items-center justify-center text-white">
      <button
        onClick={onClick}
        className="flex gap-2 rounded-4xl border border-gray-700 p-3 hover:bg-[#292A2A]"
      >
        <span className="text-sm">Create a room</span>
        <NewchatIcon />
      </button>
    </div>
  );
}

function ButtonJoiningChatRoom({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex h-[70px] items-center justify-center text-white">
      <button
        onClick={onClick}
        className="flex gap-2 rounded-4xl border border-gray-700 p-3 hover:bg-[#292A2A]"
      >
        <span className="text-sm">Join a Room</span>
        <NewchatIcon />
      </button>
    </div>
  );
}

const InputBoxForRoom = forwardRef(function InputBoxForRoom(
  {
    onClick,
    setChatRoomId,
    chatRoomId,
  }: {
    onClick: () => void;
    setChatRoomId: React.Dispatch<React.SetStateAction<string>>;
    chatRoomId: string;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className="absolute z-50 flex items-center justify-center rounded-2xl border border-gray-700 bg-[#161717] p-4"
    >
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Enter Room Id"
          value={chatRoomId}
          className="rounded-xl border p-4 text-white outline-none placeholder:text-gray-500"
          onChange={(e) => setChatRoomId(e.target.value)}
        />
        <button
          onClick={onClick}
          className="cursor-pointer rounded-2xl bg-white px-8 py-2"
        >
          Join
        </button>
      </div>
    </div>
  );
});
