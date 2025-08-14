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
    // setSendMessage((prev: any) => [...prev, typeMessage]);
    setSendMessage((prev: any) => [...prev, typeMessage]);
    setTypeMessage("");

    // const token =
    //   typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // saving msg in db probably use queue.

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
      />
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
