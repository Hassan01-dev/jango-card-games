"use client";

import React from "react";
import Image from "next/image";

export default function GameRoom({ params }: { params: { roomId: string } }) {
  const gameSetting = JSON.parse(window.sessionStorage.getItem(params.roomId));
  const playerCards = gameSetting.hands.find(
    (x) => x.name === window.sessionStorage.getItem("playerName")
  );
  const oppositionCards = gameSetting.hands.filter(
    (x) => x.name !== window.sessionStorage.getItem("playerName")
  );

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

// interface Player {
//   id: number;
//   name: string;
//   hand: string[];
// }

// interface CardGameProps {
//   players: Player[];
// }

// const CardGame: FC<CardGameProps> = ({ players }) => {
//   // Function to render cards for a player
//   const renderPlayerHand = (playerId: number, hand: string[]) => (
//     <div key={playerId} className="player-hand">
//       <strong>{players[playerId - 1].name}'s Hand:</strong>
//       <br />
//       {hand.map((card, index) => (
//         <span key={index}>{card} </span>
//       ))}
//     </div>
//   );

//   return (
//     <div className="player-area">
//       <div className="player-column">
//         {players
//           .slice(0, 2)
//           .map((player) => renderPlayerHand(player.id, player.hand))}
//       </div>
//       <div className="player-column">
//         {players
//           .slice(2)
//           .map((player) => renderPlayerHand(player.id, player.hand))}
//       </div>
//     </div>
//   );
// };
