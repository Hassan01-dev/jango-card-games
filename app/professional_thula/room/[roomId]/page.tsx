import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import RoomComponent from "@views/professional_thula/room/components/Room";
// import { toast } from "react-hot-toast";

async function getGameData(roomId: string) {
  try {
    await connect();
    return await CardGame.findById(roomId);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
}

export default async function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const game = await getGameData(roomId);

  if (!game) {
    redirect("/");
  }

  if (game.isStarted) {
    redirect(`/professional_thula/game/${roomId}`);
  }

  return <RoomComponent roomId={roomId} />;
}
