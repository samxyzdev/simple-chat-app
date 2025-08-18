import axios from "axios";
import { BACKEND_URL } from "../config";
import { IconWrapper } from "./IconWrapeer";
import { PlusIconFromWhatsApp } from "./PlusIconFromWhatsApp";
import { SmileyIconFromWhatsApp } from "./SmileyIconFromWhatsApp";
import { WhatsAppSendIcon } from "./WhatsAppSendIcon";

export const MessageInputBar = ({
  setTypeMessage,
  setSendMessage,
  uniqueRoomId,
  typeMessage,
  socket,
}: {
  setTypeMessage: any;
  setSendMessage: any;
  uniqueRoomId: string;
  typeMessage: string;
  socket: any;
}) => {
  async function handleOnclick() {
    setSendMessage((prev: any) => [
      ...prev,
      { message: typeMessage, createdAt: Date.now(), from: "self" },
    ]);
    setTypeMessage("");
    await axios.post(
      `${BACKEND_URL}/rooms/${uniqueRoomId}/chats`,
      {
        message: typeMessage,
      },
      { withCredentials: true },
    );
    const data = JSON.stringify({
      type: "chat",
      uniqueRoomId,
      message: typeMessage,
    });
    socket.send(data);
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleOnclick();
    }
  };
  return (
    <div className="flex w-full items-center gap-3 rounded-3xl bg-[#242626] px-4 py-2 text-white">
      {/* Icons */}
      <IconWrapper>
        <PlusIconFromWhatsApp />
      </IconWrapper>
      <IconWrapper>
        <SmileyIconFromWhatsApp />
      </IconWrapper>
      {/* Input box that grows */}
      <input
        type="text"
        placeholder="Type a message"
        value={typeMessage}
        className="w-full bg-transparent placeholder:text-gray-400 focus:outline-none"
        onChange={(e) => setTypeMessage(e.target.value)}
        onKeyDown={handleEnter}
      />
      {/* <input type="text" name="" id="" /> */}
      {/* Right section: Mic icon */}
      <button onClick={handleOnclick}>
        <IconWrapper>
          {/* <MicIconFromWhatsApp /> */}
          <WhatsAppSendIcon />
        </IconWrapper>
      </button>
    </div>
  );
};
