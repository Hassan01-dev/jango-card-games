import Image from "next/image";
import { cookies } from "next/headers";

export default function Game({ hands, game }: { hands: any; game: any }) {
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
