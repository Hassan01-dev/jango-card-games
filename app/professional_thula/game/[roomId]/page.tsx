import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { redirect } from "next/navigation";
import Image from "next/image";
import { CardDeck } from "@/utils/shared/cardDeck";
import { cookies } from "next/headers";

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
          let hands = [];
          if (cardGame.hands.length > 0) {
            hands = cardGame.hands;
          } else {
            const currentDeck = new CardDeck();
            currentDeck.shuffleDeck();
            hands = currentDeck.distributeCards(cardGame.playersName);
            cardGame.hands = hands;
            await cardGame.save();
          }
          return <GameComponent hands={hands} game={cardGame} />;
        } else {
          redirect(`/professional_thula/room/${roomId}`);
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

function GameComponent({ hands, game }: { hands: any; game: any }) {
  const playerName = cookies().get("playerName")?.value;
  const playerCards = hands.find((x: any) => x.name === playerName);
  const oppositionCards = hands.filter((x: any) => x.name !== playerName);
  return (
    <div className="professional_thula">
      <div className="opposition">
        {oppositionCards &&
          oppositionCards.map((hand: any, index: number) => (
            <div key={index} className="opposition_player_cards">
              <p>Player Name : {hand.name}</p>
              <p>Card Remaining : {hand.cards.length}</p>
            </div>
          ))}
      </div>
      <div className="game_table">Game Table</div>
      <div className="player_cards">
        <div>
          <p>Player Name : {playerCards.name}</p>
          <p>Card Remaining : {playerCards.cards.length}</p>
        </div>
        <div className="flex">
          {playerCards &&
            playerCards.cards.map((card: string, index: number) => (
              <div key={index} className="display_card">
                <Image
                  src={`/images/card_images/${card}.png`}
                  alt={card}
                  width={100}
                  height={300}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
