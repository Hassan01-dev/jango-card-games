import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";

export default function Room({ params }: { params: { roomId: string } }) {
  const { roomId } = params;

  const fetchData = async () => {
    try {
      connect();
      const game = await CardGame.findById(roomId);
      if (game) {
        if (!game.isStarted) {
          return <RoomComponent />;
        } else {
          redirect(`/professional_thula/game/${roomId}`);
        }
      } else {
        redirect("/");
        // return <div>Room not found</div>;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      redirect("/");
      // return <div>Error fetching data</div>;
    }
  };

  return <>{fetchData()}</>;
}

function RoomComponent() {
  return (
    <div className="room">
      <div className="room-players">
        <div className="player-card">Jango</div>
        <div className="player-card">Player 1</div>
        <div className="player-card">Player 2</div>
        <div className="player-card">Player 3</div>
      </div>
      <div className="create-game-trigger">
        <button>Start Game</button>
      </div>
    </div>
  );
}
