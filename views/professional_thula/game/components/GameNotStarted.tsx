"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GameChat from "./GameChat";
import { IMsgDataTypes } from "@/utils/types";

interface Props {
  playerNames: string[];
  handleStartGame: () => void;
  playerId: string;
  ownerId: string;
  playerName: string;
  roomId: string;
  chat: IMsgDataTypes[];
  emitChatEvent: (msgData: IMsgDataTypes) => void;
}

export default function GameNotStarted({
  playerNames,
  handleStartGame,
  playerId,
  ownerId,
  playerName,
  roomId,
  chat,
  emitChatEvent,
}: Props) {
  const isOwner = playerId === ownerId;

  // Position players evenly in a circle
  const angleStep = 360 / Math.max(playerNames.length, 1);
  const radius = 200; // radius of the circle

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 space-y-8 bg-background text-foreground">
        <Card className="relative w-[500px] h-[500px] rounded-full border-2 border-muted shadow-xl flex items-center justify-center">
          {/* Centered waiting gif */}
          <Image
            src="/Waiting.gif"
            alt="Waiting animation"
            width={200}
            height={200}
            className="z-10"
          />

          {/* Player badges around the circle */}
          {playerNames.map((name, index) => {
            const angle = angleStep * index - 90; // -90 to start from top
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={index}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 text-center",
                  "text-sm font-medium bg-muted px-3 py-1 rounded-full shadow-md"
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <div>{name}</div>
                {ownerId === name && <Badge variant="default">Owner</Badge>}
                {playerId === name && <Badge variant="secondary">You</Badge>}
              </div>
            );
          })}
        </Card>

        <div className="w-full max-w-sm">
          <Button
            onClick={handleStartGame}
            disabled={!isOwner}
            className="w-full"
          >
            {isOwner ? "Start Game" : "Waiting for Owner to Start"}
          </Button>
        </div>
      </div>

      <div className="absolute right-4 bottom-4 w-76">
        <GameChat
          playerName={playerName}
          roomId={roomId}
          chat={chat}
          emitChatEvent={emitChatEvent}
        />
      </div>
    </>
  );
}
