"use client"
import { useSocket } from "@views/professional_thula/hooks/useSocket";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const GameChat = ({ username, roomId }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const { socket } = useSocket();

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId: roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket?.emit("game_chat", msgData);
      setCurrentMsg("");
    }
  };
  
  const handleChatMessage = (data: IMsgDataTypes) => {
    setChat((pre) =>[...pre, data]);
  }
  

  useEffect(() => {
    socket?.on("chat_message", handleChatMessage);

    return () => {
      socket?.off("chat_message", handleChatMessage);
    }
  }, []);

  return (
    <div>
      <div className="chat-messages">
        {chat.map(({ roomId, user, msg, time }, key) => (
          <div
            key={key}
            className={`chat-profile ${ user == username && "flex-row-reverse" }`}
          >
            <span
              className="chat-profile-span"
              style={{ textAlign: user == username ? "right" : "left" }}
            >
              {user.charAt(0)}
            </span>
            <h3 style={{ textAlign: user == username ? "right" : "left" }}>
              {msg}
            </h3>
          </div>
        ))}
      </div>
      <hr className="my-2"/>
      <div className="chat-input">
        <form onSubmit={(e) => sendData(e)}>
          <input
            type="text"
            value={currentMsg}
            placeholder="Type your message.."
            onChange={(e) => setCurrentMsg(e.target.value)}
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default GameChat;
