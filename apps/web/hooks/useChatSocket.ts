import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export async function useChatSocket(setSocket: any) {
  // Establish WebSocket connection on component mount
  const [token, setToken] = useState("");
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setToken(data.token));
  }, []);
  useEffect(() => {
    if (!token) {
      console.log("No token available");
      return;
    }
    console.log("Attempting to connect WebSocket...");
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);
    ws.onopen = () => {
      console.log("WebSocket connected successfully");
      setSocket(ws);
    };
    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      setSocket(null);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocket(null);
    };
    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [token, setSocket]);
}
