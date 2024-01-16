import Image from "next/image";
import { cookies } from "next/headers";
import GameChat from "./GameChat"

export default function Game({ hands, game }: { hands: any; game: any }) {
  const playerName = cookies().get("playerName")?.value;
  const playerCards = hands.find((x: any) => x.name === playerName);
  const oppositionCards = hands.filter((x: any) => x.name !== playerName);
  return (
    <div className="professional-thula">
      <div className="opposition">
        {oppositionCards &&
          oppositionCards.map((hand: any, index: number) => (
            <div key={index} className="opposition-player-cards">
              <p>Player Name : {hand.name}</p>
              <p>Card Remaining : {hand.cards.length}</p>
            </div>
          ))}
      </div>
      <div className="game-table">
        <div className="play-area">Game Table</div>
        <div className="chat-area"><GameChat username={playerName} game={game} /></div>
      </div>
      <div className="player-cards">
        <div>
          <p>Player Name : {playerCards.name}</p>
          <p>Card Remaining : {playerCards.cards.length}</p>
        </div>
        <div className="flex">
          {playerCards &&
            playerCards.cards.map((card: string, index: number) => (
              <div key={index} className="display-card">
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
