"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import useThullaGame from "@/hooks/useThullaGame";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Game() {
  const searchParams = useSearchParams();

  const { playerName, setPlayerName, createGame, joinGame } = useThullaGame("");
  const [roomId, setRoomId] = useState(searchParams.get("roomId") || "");

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="bg-white/10 border border-white/20 text-white w-full max-w-xl p-6 shadow-xl space-y-6 rounded-2xl">
        <div>
          <Label htmlFor="player_name" className="text-sm mb-1 block">
            Your Name
          </Label>
          <Input
            id="player_name"
            placeholder="Enter your name"
            value={playerName}
            className="flex-1 bg-transparent text-white border-white/30 focus:ring-0"
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <Button onClick={createGame} className="w-full">
          Create Room
        </Button>

        <Separator className="my-4 bg-white/30" />

        <div>
          <Label htmlFor="room_id" className="text-sm mb-1 block">
            Room ID
          </Label>
          <Input
            id="room_id"
            placeholder="Enter room ID"
            value={roomId}
            className="flex-1 bg-transparent text-white border-white/30 focus:ring-0"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <Button onClick={() => joinGame(roomId)} variant="secondary" className="w-full">
          Join Room
        </Button>
      </Card>
    </div>
  );
}
