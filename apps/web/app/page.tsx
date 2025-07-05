"use client";
import { useState } from "react";
import { Channelwindow, GenerateRoomId } from "../components/Channelwindow";
import { MessageWindow } from "../components/MessageWindow";
import Sidebar from "../components/Sidebar";
import LandingPage from "../components/LandingPage";

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<GenerateRoomId | null>(null);
  return (
    <main className="flex">
      {/* <Sidebar />
      <Channelwindow onSelectRoom={setSelectedRoom} />
      {selectedRoom && <MessageWindow selectedRoom={selectedRoom} />} */}
      <LandingPage />
    </main>
  );
}
