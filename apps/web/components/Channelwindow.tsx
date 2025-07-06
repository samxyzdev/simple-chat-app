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
}: {
  onSelectRoom: (room: GenerateRoomId) => void;
}) => {
  const [generateRoomId, setGenerateRoomId] = useState<GenerateRoomId[]>([]);
  const [recall, setRecall] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [chatRoomId, setChatRoomId] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const ref = useClickAway(() => {
    setShowJoinRoom(false);
  });

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
  }, [recall]);

  const handleGenerateRoomId = async () => {
    if (!token) return;
    await axios.get(`${BACKEND_URL}/generate-room-id`, {
      headers: {
        Authorization: token,
      },
    });
    setRecall((prev) => !prev);
  };

  const handleRoom = (roomName: string) => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}/?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomName,
      });
      ws.send(data);
    };
    const clickedRoom = generateRoomId.find(
      (room) => room.chatRoom.roomName === roomName,
    );
    if (clickedRoom) {
      onSelectRoom(clickedRoom);
    }
  };

  const handleJoinRoom = () => {
    if (!socket || !chatRoomId) return;
    const data = JSON.stringify({
      type: "chat",
      roomName: chatRoomId,
    });
    socket.send(data);
  };

  return (
    <section className="w-xl border-r border-gray-700 bg-[#161717]">
      <ChannelHeader />
      <div className="px-4">
        <SearchBar />
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
            onClick={() => setShowJoinRoom((prev) => !prev)}
          />
          {showJoinRoom && (
            <InputBoxForRoom
              ref={ref as React.RefObject<HTMLDivElement>}
              onClick={handleJoinRoom}
              setChatRoomId={setChatRoomId}
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
        <span>Create a room</span>
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
        <span>Join a Room</span>
        <NewchatIcon />
      </button>
    </div>
  );
}

const InputBoxForRoom = forwardRef(function InputBoxForRoom(
  {
    onClick,
    setChatRoomId,
  }: {
    onClick: () => void;
    setChatRoomId: React.Dispatch<React.SetStateAction<string>>;
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
          className="rounded-xl border p-4 text-gray-500 outline-none placeholder:text-gray-500"
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
