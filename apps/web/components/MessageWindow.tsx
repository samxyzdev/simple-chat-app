"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { GenerateRoomId } from "./Channelwindow";
import { MessageInputBar } from "./MessageInputBar";
import { MessageWindowHeader } from "./MessageWinddowHeader";

type ChatMessage = {
  userId: string;
  message: string;
};

type WebSocketMessage = {
  message: string;
};

// const parseJwt = (token: string | null): { userId: string } | null => {
//   try {
//     if (!token) return null;
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// };

export const MessageWindow = ({
  selectedRoom,
  socket,
}: {
  selectedRoom: GenerateRoomId;
  socket: WebSocket | null;
}) => {
  const [typeMessage, setTypeMessage] = useState<string>("");
  const [messagesFromBackend, setMessagesFromBackend] = useState<ChatMessage[]>(
    [],
  );
  // const [jwtUserId, setJwtUserId] = useState<string>("");
  const [sendMessage, setSendMessage] = useState<string[]>([]);
  const [wsMessage, setWsMessage] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messagesFromBackend, sendMessage]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event: MessageEvent<string>) => {
      console.log("📩 New message from WebSocket:", event.data);
      try {
        const parsed: WebSocketMessage = JSON.parse(event.data);
        setWsMessage((prev) => [...prev, parsed.message]);
      } catch (err) {
        console.error("❌ Error parsing WS message:", err);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  useEffect(() => {
    // const token =
    //   typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // const currentUserId = parseJwt(token)?.userId ?? "";
    // setJwtUserId(currentUserId);

    axios
      .get(`${BACKEND_URL}/rooms/${selectedRoom.chatRoom.uniqueRoomId}/chats`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessagesFromBackend(res.data.getAllThechats as ChatMessage[]);
      });
  }, [typeMessage, selectedRoom]);

  return (
    <section className="-z-10 hidden w-full flex-col justify-between bg-[#161717] bg-[url('../images/background.png')] bg-blend-soft-light sm:flex">
      <MessageWindowHeader
        roomId={selectedRoom.chatRoom.roomName ?? "Unknown"}
      />
      <div>
        <div
          ref={containerRef}
          className="no-scrollbar mx-auto flex max-h-[796px] max-w-7xl flex-col gap-2 overflow-y-auto px-4 py-2"
        >
          {messagesFromBackend.map((data, idx) =>
            data.userId === selectedRoom.userId ? (
              <p
                key={idx}
                className={`max-w-max self-end rounded-lg bg-[#242626] p-2 text-sm text-white`}
              >
                {data.message}
              </p>
            ) : (
              <p
                key={idx}
                className="ml-16 max-w-max self-start rounded-lg bg-[#144D37] p-2 text-sm break-words text-white"
              >
                {data.message}
              </p>
            ),
          )}

          {sendMessage.map((msg, idx) => (
            <p
              key={idx}
              className={`max-w-max self-end rounded-lg bg-[#242626] p-2 text-sm text-white`}
            >
              {msg}
            </p>
          ))}

          {wsMessage.map((msg, idx) => (
            <p
              key={idx}
              className="ml-16 max-w-max self-start rounded-lg bg-[#144D37] p-2 text-sm break-words text-white"
            >
              {msg}
            </p>
          ))}
        </div>

        <div className="w-full px-4 pb-2">
          <MessageInputBar
            setSendMessage={setSendMessage}
            setTypeMessage={setTypeMessage}
            typeMessage={typeMessage}
            uniqueRoomId={selectedRoom.chatRoom.uniqueRoomId}
            socket={socket}
          />
        </div>
      </div>
    </section>
  );
};
