"use client";
import { useRouter } from "next/navigation";
import { startGame } from "../actions";
export default function Room({ roomId }: { roomId: string }) {
  const router = useRouter()
  const playerNames = ["Jango", "Player 1", "Player 2", "Player 3"];

  const handleStartGame = async () => {
    await startGame(roomId, playerNames)
    router.push(`/professional_thula/game/${roomId}`);
  }

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
        <button onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
