"use client";
import { useClickAway } from "@uidotdev/usehooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useChatSocket } from "../hooks/useChatSocket";
import { ButtonCreatingChatRoom } from "./ButtonCreatingChatRoom";
import { ButtonJoiningChatRoom } from "./ButtonJoiningChatRoom";
import { ChannelCard } from "./ChannelCard";
import { ChannelHeader } from "./ChannelHeader";
import { InputBoxForCreateRoom, InputBoxForJoinRoom } from "./InputBoxForRoom";
import { SearchBar } from "./SearchBar";

export interface GenerateRoomId {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string;
  chatRoom: {
    id: string;
    roomName: string;
    chatRoomName: string;
    chats: [
      {
        id: string;
        message: string;
        createdAt: string;
      },
    ];
  };
}

export const Channelwindow = ({
  setSelectedRoom,
  setSocket,
  socket,
}: {
  setSelectedRoom: (room: GenerateRoomId) => void;
  setSocket: any;
  socket: any;
}) => {
  const [roomsFromBackend, setRoomsFromBackend] = useState<GenerateRoomId[]>(
    [],
  );
  const [recall, setRecall] = useState(false);
  const [showJoinRoomBox, setShowJoinRoomBox] = useState(false);
  const [showCreateRoomBox, setShowCreateRoomBox] = useState(false);
  const [chatRoomId, setChatRoomId] = useState("");
  const [chatRoomName, setChatRoomName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [joinRoomLaoding, setJoinRoomLaoding] = useState(false);
  const router = useRouter();
  const ref = useClickAway(() => {
    setShowJoinRoomBox(false);
    setShowCreateRoomBox(false);
  });
  useChatSocket(setSocket);
  // getting generated rooms from server
  useEffect(() => {
    getRoomId();
  }, [recall, showJoinRoomBox]);

  async function getRoomId() {
    try {
      const response = await axios.get(`${BACKEND_URL}/rooms/my`, {
        withCredentials: true,
      });
      setRoomsFromBackend(response.data.allTheRoomName || []);
      console.dir(response.data.allTheRoomName);
    } catch (error: any) {
      if (error.response?.status === 400) {
        router.push("/");
        return;
      }
    }
  }

  const handleGenerateRoomId = async () => {
    setJoinRoomLaoding(true);
    // if (!token) return;
    await axios.post(
      `${BACKEND_URL}/rooms`,
      { chatRoomName },
      { withCredentials: true },
    );
    setJoinRoomLaoding(false);
    setRecall((prev) => !prev);
  };

  const handleRoom = (roomNameFromGeneratedRoom: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }
    // setRoomName(roomNameFromGeneratedRoom);
    const data = JSON.stringify({
      type: "join_room",
      roomId: roomNameFromGeneratedRoom,
    });
    socket.send(data);
    // Copying this logic in handleJoinRoom
    const clickedRoom = roomsFromBackend.find(
      (room) => room.chatRoom.roomName === roomNameFromGeneratedRoom,
    );
    if (clickedRoom) {
      setSelectedRoom(clickedRoom);
    }
  };

  const handleJoinRoom = async () => {
    await axios.post(
      `${BACKEND_URL}/rooms/${roomName}/members`,
      {
        chatRoomId: chatRoomId,
      },
      // {
      //   headers: {
      //     Authorization: token,
      //   },
      // },
    );

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

    // save join romm in DB and redner it on screen.

    const data = JSON.stringify({
      type: "join_room",
      roomName: chatRoomId.trim(),
    });

    try {
      socket.send(data);
      setShowJoinRoomBox(false);
      setChatRoomId("");
      const clickedRoom = roomsFromBackend.find(
        (room) => room.chatRoom.roomName === roomName,
      );
      if (clickedRoom) {
        setSelectedRoom(clickedRoom);
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

      <div className="no-scrollbar max-h-[790px] overflow-y-auto p-2">
        {roomsFromBackend.length === 0 ? (
          <p className="text-center text-white">
            No chat rooms found. Create one!
          </p>
        ) : (
          roomsFromBackend.map((element, idx) => (
            <ChannelCard
              key={idx}
              name={element.chatRoom.chatRoomName ?? "Unknown"}
              lastMessage={element.chatRoom.chats[0]?.message ?? ""}
              time={
                new Date(
                  element.chatRoom.chats[0]?.createdAt || "",
                ).toString() !== "Invalid Date"
                  ? new Date(
                      element.chatRoom.chats[0].createdAt,
                    ).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                  : ""
              }
              chatRoomName={element.chatRoom.roomName}
              onClick={() => handleRoom(element.chatRoom.roomName)}
            />
          ))
        )}
        <div className="flex justify-center gap-3">
          <ButtonCreatingChatRoom
            // onClick={handleGenerateRoomId}
            onClick={() => setShowCreateRoomBox((prev) => !prev)}
            laoding={joinRoomLaoding}
          />
          <ButtonJoiningChatRoom
            onClick={() => setShowJoinRoomBox((prev) => !prev)}
          />
          {showJoinRoomBox && (
            <InputBoxForJoinRoom
              ref={ref as React.RefObject<HTMLDivElement>}
              onClick={handleJoinRoom}
              setChatRoomId={setChatRoomId}
              chatRoomId={chatRoomId}
            />
          )}
          {showCreateRoomBox && (
            <InputBoxForCreateRoom
              ref={ref as React.RefObject<HTMLDivElement>}
              onClick={handleGenerateRoomId}
              setChatRoomName={setChatRoomName}
              chatRoomName={chatRoomName}
            />
          )}
        </div>
      </div>
    </section>
  );
};
