"use client";

import { useSocket } from "@views/professional_thula/hooks/useSocket";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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

  const handleRoomCreated = useCallback(
    ({ roomId }: { roomId: string }) => {
      router.push(`/professional_thula/${roomId}`);
    },
    [router]
  );

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

    router.push(`/professional_thula/${roomId}`);
  };

  return (
    <div className="flex justify-center mt-24">
      <Card className="w-full max-w-xl p-6 shadow-xl space-y-6 rounded-2xl">
        <div>
          <Label htmlFor="player_name" className="text-sm mb-1 block">
            Your Name
          </Label>
          <Input
            id="player_name"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <Button onClick={handleCreateGame} className="w-full">
          Create Room
        </Button>

        <Separator className="my-4" />

        <div>
          <Label htmlFor="room_id" className="text-sm mb-1 block">
            Room ID
          </Label>
          <Input
            id="room_id"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <Button onClick={handleJoinGame} variant="secondary" className="w-full">
          Join Room
        </Button>
      </Card>
    </div>
  );
}
