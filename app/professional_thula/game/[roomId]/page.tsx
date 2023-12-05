import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import GameComponent from "@views/professional_thula/game/components/Game"

export default async function GameRoom({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = params;

  const fetchData = async () => {
    try {
      connect();
      const cardGame = await CardGame.findById(roomId);

      if (cardGame) {
        if (cardGame.isStarted && !cardGame.isCompleted) {
          return <GameComponent hands={cardGame.hands} game={cardGame} />;
        } else {
          redirect(`/professional_thula/room/${roomId}`);
        }
      } else {
        redirect("/");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      redirect("/");
    }
  };

  return <>{fetchData()}</>;
}

