import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import RoomComponent from "@views/professional_thula/room/components/Room";
// import { toast } from "react-hot-toast";

export default function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = params;

  const fetchData = async () => {
    connect();
    const game = await CardGame.findById(roomId);
    if (game) {
      if (!game.isStarted) {
        return <RoomComponent roomId={roomId} />;
      } else {
        redirect(`/professional_thula/game/${roomId}`);
      }
    } else {
      redirect("/");
    }
  };

  return <>{fetchData()}</>;
}
