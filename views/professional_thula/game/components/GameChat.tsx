"use client"
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface IMsgDataTypes {
  gameId: String | number;
  user: String;
  msg: String;
  time: String;
}

var socket: Socket;
socket = io("http://localhost:3001");

const GameChat = ({ username, game }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        gameId: game?._id,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("game_chat", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.emit("join_game", game?._id);
  }, []);

  useEffect(() => {
    socket.on("chat_message", (data: IMsgDataTypes) => {
      setChat((pre) =>[...pre, data]);
    });
  }, [socket]);


  return (
    <div>
      <div className="chat-messages">
        {chat.map(({ gameId, user, msg, time }, key) => (
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
