"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import useGame from "@/hooks/useGame";

export default function Game() {
  const { playerName, setPlayerName, roomId, setRoomId, createGame, joinGame } =
    useGame("");

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

        <Button onClick={createGame} className="w-full">
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

        <Button onClick={joinGame} variant="secondary" className="w-full">
          Join Room
        </Button>
      </Card>
    </div>
  );
}
