"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMsgDataTypes } from "@/utils/types";
import { MoreVertical } from "lucide-react";

const chatOptions = [
  { label: "Hiiii", key: "hi" },
  { label: "Arigato (Male)", key: "arigato_male" },
  { label: "Arigato (Female)", key: "arigato_female" },
  { label: "Choco Minto", key: "choco_minto" },
  { label: "Missile", key: "missile" },
  { label: "Thulla", key: "thulla" },
  { label: "Pan Di Siri", key: "pds" },
  { label: "Oh Shit!", key: "oh_shit" },
  { label: "Hauli Hauli", key: "hauli_hauli" },
  { label: "Darkness", key: "darkness" }
];

const GameChat = ({
  playerName,
  roomId,
  chat,
  emitChatEvent,
  handleSendAudioMessage,
}: {
  playerName: string;
  roomId: string;
  chat: IMsgDataTypes[];
  emitChatEvent: (msgData: IMsgDataTypes) => void;
  handleSendAudioMessage: (key: string) => void;
}) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [disabledKey, setDisabledKey] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg.trim() === "") return;

    emitMessage(currentMsg);
    setCurrentMsg("");
  };

  const emitMessage = (message: string) => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: playerName,
      message,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    };

    emitChatEvent(msgData);
  };

  const handleDropdownSelect = (key: string) => {
    if (disabledKey === key) return;

    handleSendAudioMessage(key);
    setDisabledKey(key);
    setShowDropdown(false);

    setTimeout(() => {
      setDisabledKey(null);
    }, 2000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <Card className="w-full max-w-md mx-auto p-4 shadow-2xl space-y-4 relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md backdrop-saturate-150 text-white">
      <h2 className="text-xl font-semibold text-center">Game Chat</h2>

      <ScrollArea className="h-64 rounded-xl border border-white/20 p-2 bg-white/10 backdrop-blur-sm backdrop-saturate-150 space-y-3 overflow-y-auto">
        {chat.map(({ user, message, time }, index) => {
          const isMe = user === playerName;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md ${
                  isMe
                    ? "bg-blue-500/20 text-blue-100 backdrop-blur-sm"
                    : "bg-white/20 text-white backdrop-blur-sm"
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
                <p className="text-xs text-white/60 text-right mt-1">
                  {user} @ {time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </ScrollArea>

      <form
        onSubmit={sendData}
        className="flex items-center gap-2 relative bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20"
      >
        <Input
          type="text"
          placeholder="Your message..."
          value={currentMsg}
          onChange={(e) => setCurrentMsg(e.target.value)}
          className="flex-1 bg-transparent text-white border-none focus:ring-0 !placeholder-gray-300"
        />
        <Button type="submit" className="bg-white/10 hover:bg-white/20">
          Send
        </Button>

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="p-2 text-white bg-white/10 hover:bg-white/20"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <MoreVertical size={20} />
          </Button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-white/10 border border-white/20 rounded shadow-md z-50 backdrop-blur-md p-1 h-[200px] overflow-y-auto">
              {chatOptions.map((opt) => (
                <button
                  key={opt.key}
                  disabled={disabledKey === opt.key}
                  onClick={() => handleDropdownSelect(opt.key)}
                  className={`block w-64 text-left px-4 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded ${
                    disabledKey === opt.key
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </Card>
  );
};

export default GameChat;
