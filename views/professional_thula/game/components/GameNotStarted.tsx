"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GameChat from "./GameChat";
import { IMsgDataTypes, OpponentType } from "@/utils/types";

interface Props {
  opponents: OpponentType[];
  handleStartGame: () => void;
  playerId: string;
  ownerId: string;
  playerName: string;
  roomId: string;
  chat: IMsgDataTypes[];
  emitChatEvent: (msgData: IMsgDataTypes) => void;
  handleKickPlayer: (playerId: string) => void;
  handleSendAudioMessage: (key: string) => void;
}

export default function GameNotStarted({
  opponents,
  handleStartGame,
  playerId,
  ownerId,
  playerName,
  roomId,
  chat,
  emitChatEvent,
  handleKickPlayer,
  handleSendAudioMessage
}: Props) {
  const isOwner = playerId === ownerId;

  // Position players evenly in a circle
  const angleStep = 360 / Math.max(opponents.length, 1);
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
          {opponents.map((opponent, index) => {
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
                <div>{opponent.name}</div>
                {ownerId === opponent.id && <Badge variant="default">Owner</Badge>}
                {playerId === opponent.id && <Badge variant="secondary">You</Badge>}
                {isOwner && playerId !== opponent.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleKickPlayer(opponent.id)}
                    className="ml-2"
                  >
                    <Image src="/kick.svg" alt="Kick" width={20} height={20} />
                  </Button>
                )}
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

      <div className="absolute right-4 bottom-1/3 w-76">
        <GameChat
          playerName={playerName}
          roomId={roomId}
          chat={chat}
          emitChatEvent={emitChatEvent}
          handleSendAudioMessage={handleSendAudioMessage}
        />
      </div>
    </>
  );
}
