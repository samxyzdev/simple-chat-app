"use client";

import { useState } from "react";
import { Channelwindow, GenerateRoomId } from "../../components/Channelwindow";
import { MessageWindow } from "../../components/MessageWindow";
import Sidebar from "../../components/Sidebar";
import RightSideMessage from "../../components/RightSideMessage";

export default function Dashboard() {
  const [selectedRoom, setSelectedRoom] = useState<GenerateRoomId | null>(null);

  return (
    <div className="flex">
      <Sidebar />
      <Channelwindow onSelectRoom={setSelectedRoom} />
      {selectedRoom ? (
        <MessageWindow selectedRoom={selectedRoom} />
      ) : (
        <RightSideMessage />
      )}
    </div>
  );
}
