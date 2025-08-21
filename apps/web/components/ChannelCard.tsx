import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { ProfileIconFromWhatsApp } from "../icons/ProfileIcon";

export const ChannelCard = ({
  name,
  lastMessage,
  time,
  onClick,
  uniqueRoomId,
}: {
  name: string;
  uniqueRoomId: string;
  lastMessage: string;
  time: string | undefined;
  onClick: () => any;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  async function copyUniqueRoomId() {
    await navigator.clipboard.writeText(uniqueRoomId);
  }
  async function deleteRoom() {
    await axios.delete(`${BACKEND_URL}/rooms/${uniqueRoomId}`, {
      withCredentials: true,
    });
  }
  return (
    <section className="relative flex items-center gap-4 rounded-xl p-3 text-white hover:bg-[#2E2F2F]">
      <div>
        <ProfileIconFromWhatsApp />
      </div>
      <div className="flex w-full items-start justify-between">
        <div>
          <button onClick={onClick}>
            <h1 className="cursor-pointer">{name}</h1>
          </button>
          <p className="text-sm text-gray-500">{lastMessage}</p>
        </div>
        <p className="text-[12px] text-gray-50">{time}</p>
        <button
          className="cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          &#8942;
        </button>
        {showMenu && (
          <div
            className="absolute top-[40px] right-0 z-10 overflow-hidden rounded-lg bg-slate-800 shadow-lg"
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={() => {
                setShowMenu(false);
                copyUniqueRoomId();
              }}
              className="cursor-pointer bg-neutral-50 px-4 py-2 text-left text-sm text-gray-500 hover:bg-[#242525] hover:text-white active:bg-[#0f0f0f]"
              title="Copy room id"
            >
              Copy
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                deleteRoom();
              }}
              className="cursor-pointer bg-neutral-50 px-4 py-2 text-left text-sm text-red-500 hover:bg-[#242525] hover:text-red-400 active:bg-[#0f0f0f]"
              title="Delete room"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
