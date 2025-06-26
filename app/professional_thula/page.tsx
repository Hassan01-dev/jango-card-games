"use client";

import { useSocket } from "@views/professional_thula/hooks/useSocket";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Game() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socket, emit } = useSocket();

  useEffect(() => {
    const savedName = typeof window !== "undefined"
      ? localStorage.getItem("playerName")
      : "";

    if (savedName) {
      setPlayerName(savedName);
    }

    const queryRoomId = searchParams.get("roomId");
    if (queryRoomId) {
      setRoomId(queryRoomId);
    }
  }, [searchParams]);

  const handleRoomCreated = useCallback(({ roomId }: { roomId: string }) => {
    // router.push(`/professional_thula/room/${roomId}`);
    router.push(`/professional_thula/${roomId}`);
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    socket.on("room_created", handleRoomCreated);
    
    return () => {
      socket.off("room_created", handleRoomCreated);
    };
  }, [socket, handleRoomCreated]);


  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name before creating a game");
      return;
    }

    const playerId = crypto.randomUUID();
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerId", playerId);
    
    emit("create_room", { playerId, playerName });
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name before joining a game");
      return;
    }

    const playerId = crypto.randomUUID();
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerId", playerId);
    
    // router.push(`/professional_thula/room/${roomId}`);
    router.push(`/professional_thula/${roomId}`);
  };

  return (
    <div className="mx-auto mt-24 w-1/3">
      <div className="flex items-center justify-between">
        <div className="mb-2 block">
          <Label htmlFor="player_name" value="Your Name" />
        </div>
        <TextInput
          id="player_name"
          className="w-3/4"
          addon="@"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
      </div>
      <hr className="m-4" />
      <div className="flex flex-col items-center">
        <Button onClick={handleCreateGame}>Create Room</Button>
        <span className="m-2">OR</span>
        <div className="flex items-center justify-between">
          <div className="mb-2 block">
            <Label htmlFor="room_id" value="Room ID" />
          </div>
          <TextInput
            id="room_id"
            className="w-3/4"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>
        <Button onClick={handleJoinGame}>Join Room</Button>
      </div>
    </div>
  );
}
