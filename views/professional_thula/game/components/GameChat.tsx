"use client";

import { useSocket } from "@views/professional_thula/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IMsgDataTypes {
  roomId: string | number;
  user: string;
  msg: string;
  time: string;
}

const GameChat = ({ username, roomId }: { username: string; roomId: string }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { socket } = useSocket();

  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      notificationAudioRef.current = new Audio("/notification.wav");
    }
  }, []);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg.trim() === "") return;

    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: currentMsg,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    };

    socket?.emit("game_chat", msgData);
    setCurrentMsg("");
  };

  const handleChatMessage = (data: IMsgDataTypes) => {
    setChat((prev) => [...prev, data]);
    if (data.user !== username && notificationAudioRef.current) {
      notificationAudioRef.current.play().catch();
    }
  };

  useEffect(() => {
    socket?.on("chat_message", handleChatMessage);
    return () => {
      socket?.off("chat_message", handleChatMessage);
    };
  }, [socket]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <Card className="w-full max-w-md mx-auto p-4 shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-center">Game Chat</h2>

      <ScrollArea className="h-64 rounded-md border p-2 bg-muted/20 space-y-3 overflow-y-auto">
        {chat.map(({ user, msg, time }, index) => {
          const isMe = user === username;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] px-3 py-2 rounded-xl shadow-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                <p className="text-sm font-medium">{msg}</p>
                <p className="text-xs text-muted-foreground text-right mt-1">{user} @ {time}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </ScrollArea>

      <form onSubmit={sendData} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={currentMsg}
          onChange={(e) => setCurrentMsg(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </Card>
  );
};

export default GameChat;