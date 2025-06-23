import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import GameComponent from "@views/professional_thula/game/components/Game";

interface GameRoomProps {
  params: {
    roomId: string;
  };
}

async function getGameData(roomId: string) {
  try {
    await connect();
    return await CardGame.findById(roomId);
  } catch (error) {
    console.error("Error fetching game data:", error);
    return null;
  }
}

export default async function GameRoom({ params }: GameRoomProps) {
  const { roomId } = params;
  const cardGame = await getGameData(roomId);

  if (!cardGame) {
    redirect("/");
  }

  if (!cardGame.isStarted || cardGame.isCompleted) {
    redirect(`/professional_thula/room/${roomId}`);
  }

  return <GameComponent hands={cardGame.hands} game={cardGame} />;
}
