"use client";

import { useState } from "react";
import { Channelwindow, GenerateRoomId } from "../../components/Channelwindow";
import { MessageWindow } from "../../components/MessageWindow";
import Sidebar from "../../components/Sidebar";
import RightSideMessage from "../../components/RightSideMessage";

export default function Dashboard() {
  const [selectedRoom, setSelectedRoom] = useState<GenerateRoomId | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  return (
    <main className="flex">
      <Sidebar />
      <Channelwindow
        onSelectRoom={setSelectedRoom}
        setSocket={setSocket}
        socket={socket}
      />
      {selectedRoom ? (
        <MessageWindow selectedRoom={selectedRoom} socket={socket} />
      ) : (
        <RightSideMessage />
      )}
    </main>
  );
}
