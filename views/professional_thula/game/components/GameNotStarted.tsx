"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  playerNames: string[];
  handleStartGame: () => void;
  playerId: string;
  ownerId: string;
}

export default function GameNotStarted({
  playerNames,
  handleStartGame,
  playerId,
  ownerId,
}: Props) {
  const isOwner = playerId === ownerId;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 space-y-8">
      <Card className="w-full max-w-xl p-6 space-y-6 shadow-2xl rounded-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Waiting for Players...</h2>
          <p className="text-muted-foreground">
            The game will start once all players have joined.
          </p>
        </div>

        <ScrollArea className="h-48 rounded-md border p-4 bg-muted/20">
          <div className="space-y-2">
            {playerNames.map((name, index) => (
              <Card key={index} className="p-3 flex items-center justify-between">
                <span>{name}</span>
                {ownerId === name && (
                  <Badge variant="default">Owner</Badge>
                )}
                {playerId === name && (
                  <Badge variant="secondary">You</Badge>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-center">
          <Button
            onClick={handleStartGame}
            disabled={!isOwner}
            className="w-full"
          >
            {isOwner ? "Start Game" : "Waiting for Owner"}
          </Button>
        </div>
      </Card>

      <Image
        src="/Waiting.gif"
        alt="Waiting animation"
        width={300}
        height={300}
        className="rounded-lg shadow-md"
      />
    </div>
  );
}
