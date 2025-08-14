import { useState } from "react";
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
  time: string;
  onClick: () => any;
}) => {
  const [showMenu, setShowMenu] = useState(true);
  async function copyUniqueRoomId() {
    await navigator.clipboard.writeText(uniqueRoomId);
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
          <button
            onClick={() => {
              setShowMenu(false);
              copyUniqueRoomId();
            }}
            className="absolute top-[40px] right-0 z-10 cursor-pointer rounded-lg bg-[#2E2F2F] px-4 py-2 text-center text-gray-500 hover:bg-[#242525] active:bg-[#0f0f0f]"
            title="Copy room id"
          >
            copy
          </button>
        )}
      </div>
    </section>
  );
};
