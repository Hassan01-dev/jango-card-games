import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import GameComponent from "@views/professional_thula/game/components/Game";
import { cookies } from "next/headers";

interface GameRoomProps {
  params: Promise<{
    roomId: string;
  }>;
}

async function getGameData(roomId: string) {
  try {
    await connect();
    return CardGame.findById(roomId);
  } catch (error) {
    console.error("Error fetching game data:", error);
    return null;
  }
}

export default async function GameRoom({ params }: GameRoomProps) {
  const { roomId } = await params;
  const playerName = cookies().get("playerName")?.value;
  const cardGame = await getGameData(roomId);

  if (!cardGame) {
    redirect("/");
  }

  if (!cardGame.isStarted || cardGame.isCompleted) {
    redirect(`/professional_thula/room/${roomId}`);
  }

  // Convert MongoDB document to plain object and serialize specific fields
  const serializedGame = {
    id: cardGame._id.toString(),
    roomName: cardGame.roomName,
    playerNames: cardGame.playerNames,
    hands: cardGame.hands.map((hand: { name: string; cards: string[] }) => ({
      name: hand.name,
      cards: hand.cards
    })),
    playerCount: cardGame.playerCount,
    requirePassword: cardGame.requirePassword,
    isStarted: cardGame.isStarted,
    isCompleted: cardGame.isCompleted
  };

  return <GameComponent 
    hands={serializedGame.hands} 
    game={serializedGame}
    playerName={playerName || ""}
    roomId={roomId}
  />;
}
