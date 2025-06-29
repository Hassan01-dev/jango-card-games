"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMsgDataTypes } from "@/utils/types";

const GameChat = ({ playerName, roomId, chat, emitChatEvent }: { playerName: string; roomId: string, chat: IMsgDataTypes[], emitChatEvent: (msgData: IMsgDataTypes) => void }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);  

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg.trim() === "") return;

    const msgData: IMsgDataTypes = {
      roomId,
      user: playerName,
      message: currentMsg,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    };

    emitChatEvent(msgData)
    setCurrentMsg("");
  };

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <Card className="w-full max-w-md mx-auto p-4 shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-center">Game Chat</h2>

      <ScrollArea className="h-64 rounded-md border p-2 bg-muted/20 space-y-3 overflow-y-auto">
        {chat.map(({ user, message, time }, index) => {
          const isMe = user === playerName;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] px-3 py-2 rounded-xl shadow-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                <p className="text-sm font-medium">{message}</p>
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