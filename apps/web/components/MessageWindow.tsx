"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { GenerateRoomId } from "./Channelwindow";
import { MessageInputBar } from "./MessageInputBar";
import { MessageWindowHeader } from "./MessageWinddowHeader";

const parseJwt = (token: string | null) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const MessageWindow = ({
  selectedRoom,
  socket,
}: {
  selectedRoom: GenerateRoomId;
  socket: any;
}) => {
  const [typeMessage, setTypeMessage] = useState("");
  const [messagesFromBackend, setMessagesFromBackend] = useState([]);
  const [jwtUserId, setJwtUserId] = useState("");
  const [sendMessage, setSendMessage] = useState([]);
  const [wsMessage, setWsMessage] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    console.dir(el);
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messagesFromBackend, sendMessage]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event: { data: string }) => {
      console.log("📩 New message from WebSocket:", event.data);
      // Agar aap JSON bhej rahe ho to parse kar lo
      try {
        const parsed = JSON.parse(event.data);
        console.log("📦 Parsed message:", parsed);
        // @ts-ignore
        setWsMessage((prev) => [...prev, parsed.message]);
      } catch (err) {
        console.error("❌ Error parsing WS message:", err);
      }
    };

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  // Get old
  useEffect(() => {
    console.log("request jaa rhi hai");
    console.log(selectedRoom.chatRoom.roomName);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentUserId = parseJwt(token)?.userId;
    setJwtUserId(currentUserId);
    axios
      .post(
        `${BACKEND_URL}/chats`,
        {
          roomId: selectedRoom.chatRoom.roomName,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        console.log("chats");
        // console.dir(res.data.getAllThechats[0].userId)
        console.log(res.data.getAllThechats);
        setMessagesFromBackend(res.data.getAllThechats);
      });
  }, [typeMessage, selectedRoom]);
  console.log("wsmessage");
  console.log(wsMessage);

  return (
    <section className="hidden w-full flex-col justify-between bg-[#161717] bg-[url('../images/background.png')] bg-blend-soft-light sm:flex">
      <MessageWindowHeader
        roomId={
          selectedRoom.chatRoom.roomName.split("-")[0]?.toString() ?? "Unknown"
        }
      />
      {/* Chat area (messages flow bottom-up) */}
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
        {/* Input at bottom */}
        <div className="w-full px-4 pb-2">
          <MessageInputBar
            setSendMessage={setSendMessage}
            setTypeMessage={setTypeMessage}
            typeMessage={typeMessage}
            roomId={selectedRoom.chatRoom.roomName}
            socket={socket}
          />
        </div>
      </div>
    </section>
  );
};
