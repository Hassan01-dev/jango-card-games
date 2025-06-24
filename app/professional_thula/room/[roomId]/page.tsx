import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import RoomComponent from "@views/professional_thula/room/components/Room";

async function getGameData(roomId: string) {
  try {
    await connect();
    return CardGame.findById(roomId);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
}

export default async function Room({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const game = await getGameData(roomId);
  console.log(game)

  if (!game) {
    return redirect("/");
  }

  if (game.isStarted) {
    return redirect(`/professional_thula/game/${roomId}`);
  }

  return <RoomComponent roomId={roomId} />;
}
