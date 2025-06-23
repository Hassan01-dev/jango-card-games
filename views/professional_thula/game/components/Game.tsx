"use client";

import Image from "next/image";
import GameChat from "./GameChat";
import { useEffect, useState } from "react";
import { useSocket } from "@views/professional_thula/hooks/useSocket";

export default function Game({
  hands,
  game,
  playerName,
  roomId,
}: {
  hands: any;
  game: any;
  playerName: string;
  roomId: string;
}) {
  const playerCards = hands.find((x: any) => x.name === playerName);
  const oppositionCards = hands.filter((x: any) => x.name !== playerName);
  const [myCards, setMyCards] = useState(playerCards.cards);
  const [playedCards, setPlayedCards] = useState<string[]>([]);

  const { socket } = useSocket();
  const [currentTurn, setCurrentTurn] = useState("");

  const handleUpdateTurn = ({ currentTurn }: { currentTurn: string }) => {
    setCurrentTurn(currentTurn);
  };

  const handleRoomJoined = ({
    players,
    currentTurn,
  }: {
    players: { id: string; name: string }[];
    currentTurn: string;
  }) => {
    const player = players.find((p) => p.id === currentTurn);
    setCurrentTurn(player?.name || "");
  };

  const handleTrickResult = ({ winner }: { winner: string }) => {
    alert(`Trick won by ${winner}`);
  };

  const handlePlayedCards = ({
    card,
  }: {
    playerName: string;
    card: string;
  }) => {
    setPlayedCards((prev: any) => [...prev, card ]);
  };

  useEffect(() => {
    // Join room and register event listeners
    if (socket) {
      socket.emit("join_room", { roomId, playerName });

      socket.on("update_turn", handleUpdateTurn);
      socket.on("room_joined", handleRoomJoined);
      socket.on("trick_result", handleTrickResult);
      socket.on("card_played", handlePlayedCards);
    }

    // Cleanup function to remove event listeners
    return () => {
      if (socket) {
        socket.off("update_turn", handleUpdateTurn);
        socket.off("room_joined", handleRoomJoined);
        socket.off("trick_result", handleTrickResult);
        socket.off("card_played", handlePlayedCards);
      }
    };
  }, [socket, roomId, playerName]);

  const handleClick = (card: string) => {
    if (playerName === currentTurn) {
      setMyCards((prev: any) => [...prev.filter((c: string) => c !== card)]);
      socket.emit("play_card", {
        roomId,
        playerName,
        card,
      });
    }
  };

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
      <div className="game-table bg-green-800 rounded-3xl p-8 shadow-2xl relative min-h-[500px] flex flex-col items-center justify-between">
        <div className="play-area text-2xl font-bold text-white mb-6">Game Table</div>
        <div className="played-cards relative h-[200px] w-[150px]">
          {playedCards.map((card: string, index: number) => (
            <div 
              key={index} 
              className="played-card absolute"
              style={{
                transform: `rotate(${(index - playedCards.length/2) * 5}deg) translateY(${index * 2}px)`,
                zIndex: index,
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <Image
                src={`/images/card_images/${card}.png`}
                alt={card}
                width={100}
                height={140}
                className="rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                style={{
                  filter: "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2))",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>
          ))}
        </div>
        <div className="turn-indicator text-xl font-semibold text-white bg-green-900 px-6 py-2 rounded-full shadow-lg mb-6">
          {currentTurn === playerName ? "Your" : currentTurn + "'s"} Turn
        </div>
        <div className="chat-area w-full max-w-md bg-green-900 rounded-xl shadow-xl p-4">
          <GameChat username={playerName} game={game} roomId={roomId} />
        </div>
      </div>
      <div className="player-cards">
        <div>
          <p>Player Name : {playerCards.name}</p>
          <p>Card Remaining : {myCards.length}</p>
        </div>
        <div className="flex">
          {myCards &&
            myCards.map((card: string, index: number) => (
              <div
                key={index}
                className="relative group perspective-1000"
                onClick={() => handleClick(card)}
              >
                <div className="card-wrapper transform transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-2xl cursor-pointer">
                  <div className="card-inner relative">
                    <Image
                      src={`/images/card_images/${card}.png`}
                      alt={card}
                      width={100}
                      height={140}
                      className="rounded-lg shadow-md hover:shadow-playing-card"
                      style={{
                        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                        backfaceVisibility: "hidden",
                      }}
                    />
                    <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
