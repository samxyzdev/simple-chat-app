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

// const TagElement = ["ALL", "Unread", "Favourites", "Groups"];
// const ChannelCardElement = [
//   { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
// ];

// const randomName = "KYA KAR RHE HO";
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
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/get-room-id`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        console.log(result.data);
        setGenerateRoomId(result.data.allTheRoomName);
        console.log(generateRoomId);
      });
  }, [recall]);

  // backend request for generating roomId
  async function handleGenerateRoomId() {
    const token = localStorage.getItem("token");
    await axios.get(`${BACKEND_URL}/generate-room-id`, {
      headers: {
        authorization: `${token}`,
      },
    });
    setRecall((prev) => !prev);
  }
  // this function do 2 things find connect to ws and find on which card/room user clicked
  function handleRoom(roomName: string, serverSignedToken: string) {
    const token = localStorage.getItem("token");
    // ws with token
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join_room",
        roomName,
      });
      console.log(data);
      ws.send(data);
    };
    // find the clicked room from generatedRoomId list
    const clickedRoom = generateRoomId.find(
      (room) => room.chatRoom.roomName === roomName,
    );
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
        {generateRoomId.length === 0 ? (
          <p className="text-center text-white">
            Not chat rooms found. Create one!
          </p>
        ) : (
          generateRoomId.map((element, idx) => (
            <ChannelCard
              key={idx}
              name={
                element.chatRoom.roomName.split("-")[0]?.toString() ?? "Unknown"
              }
              lastMessage={"?"}
              time={"10:23"}
              onClick={() =>
                handleRoom(element.chatRoom.roomName, "dummy-signed-token")
              }
            />
          ))
        )}
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

// {
//     "allTheRoomName": [
//         {
//             "id": "01JZF2FKXTW1H9YF0XERM9YCYS",
//             "userId": "f5cc9be2-de37-4a45-bcf2-679036da2407",
//             "chatRoomId": "407b48fb-8526-417b-93f0-7206635d6eb2",
//             "joinedAt": "2025-07-06T05:14:00.507Z",
//             "chatRoom": {
//                 "id": "407b48fb-8526-417b-93f0-7206635d6eb2",
//                 "roomName": "0197de27-cdf7-7000-8dbb-47cb0d2aed8d"
//             }
//         }
//     ]
// }
