"use client";

import { useState } from "react";
import { Channelwindow, GenerateRoomId } from "../components/Channelwindow";
import { MessageWindow } from "../components/MessageWindow";
import RightSideMessage from "../components/RightSideMessage";

export default function DashboardPage() {
  const [selectedRoom, setSelectedRoom] = useState<GenerateRoomId | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  console.log("sockerereerererererrer");
  return (
    <main className="flex w-full">
      <Channelwindow
        setSelectedRoom={setSelectedRoom}
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
