"use client";
import { useEffect, useState } from "react";
import { MenuIcon } from "../icons/MenuIcon";
import { NewchatIcon } from "../icons/NewchatIcon";
import { ChannelCard } from "./ChannelCard";
import { IconWrapper } from "./IconWrapeer";
import { SearchBar } from "./SearchBar";
import { Tag } from "./Tag";
import axios from "axios";
import { BACKEND_URL, WS_URL } from "../config";
import { useRouter } from "next/navigation";

const TagElement = ["ALL", "Unread", "Favourites", "Groups"];
const ChannelCardElement = [
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
];

// const randomName = "KYA KAR RHE HO";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0YzQ2YTY1YS0wYmNkLTRiMjgtYWZmMi1mN2JjN2ZmYWE5ZTYiLCJpYXQiOjE3NTE1MjI5NTd9.N9MwLZ6sHMd4xwhMy1X-MDStLC22n9VqkiO6w2k-EXA";

export interface GenerateRoomId {
  roomId: string;
  serverSignedToken: string;
  msg: string;
}

export const Channelwindow = ({
  onSelectRoom,
}: {
  onSelectRoom: (room: GenerateRoomId) => void;
}) => {
  const [generateRoomId, setGenerateRoomId] = useState<GenerateRoomId[]>([]);
  const [socket, setSocket] = useState<WebSocket>();
  // backend request for generating roomId
  function handleGenerateRoomId() {
    axios
      .get(`${BACKEND_URL}/generate-room-id`, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then((result) => {
        const { roomId, serverSignedToken, msg } = result.data;
        setGenerateRoomId((prev) => [
          ...prev,
          { roomId, serverSignedToken, msg },
        ]);
      });
  }
  // this function do 2 things find connect to ws and find on which card/room user clicked
  function handleRoom(roomId: string, serverSignedToken: string) {
    // ws with token
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomId,
      });
      console.log(data);
      ws.send(data);
    };
    // find the clicked room from generatedRoomId list
    const clickedRoom = generateRoomId.find((room) => room.roomId === roomId);
    if (clickedRoom) {
      onSelectRoom(clickedRoom); // Notify parent to open message windows
    }
  }

  return (
    <section className="w-xl border-r border-gray-700 bg-[#161717]">
      <ChannelHeader />
      <div className="">
        {/* <IconWrapper>
          <SearchBar />
        </IconWrapper> */}
        <div className="px-4">
          <SearchBar />
        </div>
      </div>
      {/* <div className="flex justify-start space-x-2 p-2">
        {TagElement.map((tag, idx) => (
          <Tag key={idx} tagName={tag} />
        ))}
      </div> */}
      {/* [{(roomId, serverSignedMessage, msg)},{}] */}
      <div className="no-scrollbar max-h-[790px] overflow-y-auto p-3">
        {generateRoomId.map((element, idx) => (
          <ChannelCard
            key={idx}
            name={"Room Name"}
            lastMessage={"?"}
            time={"10:23"}
            onClick={() =>
              handleRoom(element.roomId, element.serverSignedToken)
            }
          />
        ))}
        <ModalForCreatingChatRoom onClick={handleGenerateRoomId} />
      </div>
    </section>
  );
};

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
      <div className="flex gap-4">
        <div className="text-white">
          <IconWrapper>
            <NewchatIcon />
          </IconWrapper>
        </div>
        <div className="text-white">
          <IconWrapper>
            <MenuIcon />
          </IconWrapper>
        </div>
      </div>
    </div>
  );
}

function ModalForCreatingChatRoom({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex h-[70px] flex-col items-center justify-center rounded-md bg-[#161717] text-white">
      <button
        onClick={onClick}
        className="flex gap-2 rounded-4xl border border-gray-700 p-3 hover:bg-[#292A2A]"
      >
        <span>Create a room</span>
        <span>
          <NewchatIcon />
        </span>
      </button>
    </div>
  );
}

// when user click on create room, room will autoamically created
// channelCard
