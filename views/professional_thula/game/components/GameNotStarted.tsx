"use client";

import Image from "next/image";

export default function GameNotStarted({ playerNames, handleStartGame, playerId, ownerId }: { playerNames: Array<string>, handleStartGame: () => void, playerId: string, ownerId: string }) {
  return (
    <div className="room">
      <div className="room-players">
        {playerNames &&
          playerNames.map((name: string, index: number) => (
            <div key={index} className="player-card">
              {name}
            </div>
          ))}
      </div>
      <div className="create-game-trigger">
        <button 
          onClick={() => ownerId === playerId && handleStartGame()}
          disabled={ownerId !== playerId}
        >
          Start Game
        </button>
      </div>

      <Image
        src="/Waiting.gif"
        alt="Testing"
        width={400}
        height={400}
      />
    </div>
  );
}
