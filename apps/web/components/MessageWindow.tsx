"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { GenerateRoomId } from "./Channelwindow";
import { MessageInputBar } from "./MessageInputBar";
import { MessageWindowHeader } from "./MessageWinddowHeader";

type messagesFromBackend = {
  createdAt: string;
  userId: string;
  message: string;
};

type WebSocketMessage = {
  message: string;
  createdAt: number;
  from: string;
};

type sendMessage = {
  message: string;
  createdAt: number;
  from: string;
};

type wsMessage = {
  message: string;
  createdAt: number;
  from: string;
};

export const MessageWindow = ({
  selectedRoom,
  socket,
}: {
  selectedRoom: GenerateRoomId;
  socket: WebSocket | null;
}) => {
  const [typeMessage, setTypeMessage] = useState<string>("");
  const [messagesFromBackend, setMessagesFromBackend] = useState<
    messagesFromBackend[]
  >([]);
  // const [jwtUserId, setJwtUserId] = useState<string>("");
  const [sendMessage, setSendMessage] = useState<sendMessage[]>([]);
  const [wsMessage, setWsMessage] = useState<wsMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  // only ws and sendMessage
  const allMessage = [...sendMessage, ...wsMessage];
  allMessage.sort((a, b) => a.createdAt - b.createdAt);
  console.dir(allMessage);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messagesFromBackend, sendMessage, wsMessage]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event: MessageEvent<string>) => {
      console.log("New message from WebSocket:", event.data);
      try {
        const parsed: WebSocketMessage = JSON.parse(event.data);
        setWsMessage((prev: any) => [
          ...prev,
          { message: parsed.message, createdAt: Date.now(), from: "ws" },
        ]);
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/rooms/${selectedRoom.chatRoom.uniqueRoomId}/chats`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessagesFromBackend(
          res.data.getAllThechats as messagesFromBackend[],
        );
      });
  }, [selectedRoom]);
  useEffect(() => {
    console.dir(sendMessage);
  });

  return (
    <section className="hidden w-full flex-col justify-between bg-[#161717] bg-[url('../images/background.png')] bg-blend-soft-light sm:flex">
      <MessageWindowHeader
        roomId={selectedRoom.chatRoom.roomName ?? "Unknown"}
      />
      <div>
        <div
          ref={containerRef}
          className="no-scrollbar mx-auto flex max-h-[796px] max-w-7xl flex-col gap-2 overflow-y-auto px-4 py-2"
        >
          {wsMessage
            .filter((msg) => msg.message !== "")
            .map((msg, idx) => (
              <div
                key={msg.createdAt}
                className="ml-16 max-w-max self-start rounded-tr-lg rounded-b-lg bg-[#242626] p-2 pr-4 text-start text-sm text-white"
              >
                {msg.message}
                <p className="relative left-3 text-end text-[9px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          {sendMessage
            .filter((msg) => msg.message !== "")
            .map((msg, idx) => (
              <div
                key={msg.createdAt}
                className={`ml-16 max-w-max self-end rounded-tl-lg rounded-b-lg bg-[#144D37] p-2 pr-4 text-start text-sm text-white`}
              >
                {msg.message}
                <p className="relative left-3 text-end text-[9px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          {messagesFromBackend.map((data, idx) =>
            data.userId === selectedRoom.userId ? (
              <div
                key={idx}
                className={`max-w-max self-end rounded-tl-lg rounded-b-lg bg-[#144D37] p-2 pr-4 text-start text-sm text-white`}
              >
                {data.message}
                <p className="relative left-3 text-end text-[9px] text-gray-400">
                  {getTime(data.createdAt)}
                </p>
              </div>
            ) : (
              <div
                key={idx}
                className="ml-16 max-w-max self-start rounded-tr-lg rounded-b-lg bg-[#242626] p-2 pr-4 text-start text-sm text-white"
              >
                {data.message}
                <p className="relative left-3 text-end text-[9px] text-gray-400">
                  {getTime(data.createdAt)}
                </p>
              </div>
            ),
          )}
          {/* {wsMessage
            .filter((msg) => msg.message !== "")
            .map((msg, idx) => (
              <div
                key={msg.createdAt}
                className="ml-16 max-w-max self-start rounded-tr-lg rounded-b-lg bg-[#242626] p-2 pr-4 text-start text-sm text-white"
              >
                {msg.message}
                <p className="relative left-3 text-end text-[9px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          {sendMessage
            .filter((msg) => msg.message !== "")
            .map((msg, idx) => (
              <div
                key={msg.createdAt}
                className={`ml-16 max-w-max self-end rounded-tl-lg rounded-b-lg bg-[#144D37] p-2 pr-4 text-start text-sm text-white`}
              >
                {msg.message}
                <p className="relative left-3 text-end text-[9px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))} */}
          {allMessage.map((msg) => (
            <div
              key={msg.createdAt}
              className={`ml-16 max-w-max rounded-b-lg p-2 pr-4 text-start text-sm text-white ${
                msg.from === "self"
                  ? "self-end rounded-tl-lg bg-[#144D37]"
                  : "self-start rounded-tr-lg bg-[#242626]"
              }`}
            >
              {msg.message}
              <p className="relative left-3 text-end text-[9px] text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
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

export const getTime = (fullDate: any) => {
  const time = new Date(fullDate).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  if (time === "Invalid Date") {
    return;
  }
  return time;
};
