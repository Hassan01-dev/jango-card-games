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
  const oppositionCards: { name: string; cards: string[] }[] = hands.filter(
    (x: any) => x.name !== playerName
  );
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
    setPlayedCards((prev: any) => [...prev, card]);
  };

  const handleThulla = ({
    triggeredBy,
    looser,
  }: {
    triggeredBy: string;
    looser: string;
  }) => {
    alert(`${triggeredBy} caught ${looser} with Thulla!`);
    setPlayedCards([]);
  };

  const handleCardsTaken = ({ cards }: { cards: string[] }) => {
    setMyCards((prev: string[]) => [...prev, ...cards]);
  };

  const handleEmptyTable = () => {
    setPlayedCards([]);
  };

  useEffect(() => {
    // Join room and register event listeners
    if (socket) {
      socket.emit("join_room", { roomId, playerName });

      socket.on("update_turn", handleUpdateTurn);
      socket.on("room_joined", handleRoomJoined);
      socket.on("trick_result", handleTrickResult);
      socket.on("card_played", handlePlayedCards);
      socket.on("thulla", handleThulla);
      socket.on("cards_taken", handleCardsTaken);
      socket.on("empty_table", handleEmptyTable);
    }
    // Cleanup function to remove event listeners
    return () => {
      if (socket) {
        socket.off("update_turn", handleUpdateTurn);
        socket.off("room_joined", handleRoomJoined);
        socket.off("trick_result", handleTrickResult);
        socket.off("card_played", handlePlayedCards);
        socket.off("thulla", handleThulla);
        socket.off("cards_taken", handleCardsTaken);
        socket.on("empty_table", handleEmptyTable);
      }
    };
  }, [socket, roomId, playerName]);

  const handleClick = (card: string) => {
    setMyCards((prev: any) => [...prev.filter((c: string) => c !== card)]);
    socket.emit("play_card", {
      roomId,
      playerName,
      card,
    });
  };

  const handleSort = () => {
    const suitOrder = { 'hearts': 1, 'diamonds': 3, 'clubs': 2, 'spades': 4 };
    
    const sortedCards = [...myCards].sort((a: string, b: string) => {
      const [aRank, , aSuit] = a.split('_');
      const [bRank, , bSuit] = b.split('_');
      
      // Compare suits first
      const suitComparison = suitOrder[aSuit as keyof typeof suitOrder] - suitOrder[bSuit as keyof typeof suitOrder];
      
      if (suitComparison !== 0) {
        return suitComparison;
      }
      
      // If suits are equal, compare ranks
      return parseInt(aRank) - parseInt(bRank);
    });
    
    setMyCards(sortedCards);
  };

  const playingSuit =
    playedCards.length > 0 ? playedCards[0].split("_")[2] : "";

  return (
    <div className="professional-thula h-screen flex bg-gradient-to-b from-green-950 to-green-800 p-4">
      {/* Opposition Players */}
      <div className="opposition grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {oppositionCards.map((hand, index) => (
          <div
            key={index}
            className="bg-green-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-white shadow-xl border border-green-600/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                {hand.name[0].toUpperCase()}
              </div>
              <h3 className="text-base sm:text-lg font-semibold">
                {hand.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-green-300 text-sm sm:text-base">
              <span>Cards:</span>
              <span className="font-bold">{hand.cards.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Game Table */}
      <div className="game-table bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-6 sm:p-12 shadow-2xl relative flex justify-between items-center border border-green-600/30 backdrop-blur-sm flex-1">
        <div className="flex play-area text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 tracking-wide">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300">
            Game Table
          </span>
        </div>
        {/* Turn Indicator */}
        <div className="turn-indicator text-sm sm:text-lg font-medium text-white bg-green-700/50 px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg mb-6 sm:mb-8 backdrop-blur-sm border border-green-500/30">
          <span className="animate-pulse inline-block w-3 h-3 bg-green-400 rounded-full mr-2" />
          {currentTurn === playerName ? "Your" : `${currentTurn}'s`} Turn
        </div>

        {/* Played Cards */}
        <div className="played-cards relative h-[200px] sm:h-[250px] w-full flex justify-center">
          <div className="relative w-[160px] sm:w-[200px]">
            {playedCards.map((card: string, index: number) => (
              <div
                key={index}
                className="played-card absolute left-1/2 -translate-x-1/2 transition-all duration-300"
                style={{
                  transform: `translateX(-50%) rotate(${
                    (index - playedCards.length / 2) * 15
                  }deg) translateY(${index * 2}px)`,
                  zIndex: index,
                }}
              >
                <Image
                  src={`/images/card_images/${card}.png`}
                  alt={card}
                  width={120}
                  height={168}
                  className="rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                  style={{
                    filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3))",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="chat-area w-full max-w-xl bg-green-800/40 rounded-2xl shadow-xl p-4 sm:p-6 backdrop-blur-md border border-green-600/30">
          <GameChat username={playerName} game={game} roomId={roomId} />
        </div>
      </div>

      {/* Player Cards */}
      <div className="player-cards mt-6 sm:mt-10 bg-green-800/40 rounded-2xl p-4 backdrop-blur-sm border border-green-600/30">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
            {playerCards.name[0].toUpperCase()}
          </div>
          <div className="text-white">
            <h3 className="text-base sm:text-xl font-semibold">
              {playerCards.name}
            </h3>
            <div className="flex items-center gap-2 text-green-300 text-sm sm:text-base">
              <span>Cards Remaining:</span>
              <span className="font-bold">{myCards.length}</span>
            </div>
            <div>
              <button onClick={handleSort}>Sort</button>
            </div>
          </div>
        </div>

        <div className="ml-8 relative flex justify-center items-end min-h-[200px] sm:min-h-[220px] px-4 sm:px-0">
          {myCards.map((card: string, index: number) => {
            const middleIndex = Math.floor(myCards.length / 2);
            const rotation = index - middleIndex;
            const [, , suit] = card.split("_");

            const isPlayerTurn = currentTurn === playerName;
            const leadSuit = playingSuit; // lead suit from first card played in this round

            const hasLeadSuit = myCards.some(
              (c: any) => c.split("_")[2] === leadSuit
            );

            const mustFollowSuit = !!leadSuit && hasLeadSuit;
            const isValidCard = !mustFollowSuit || suit === leadSuit;

            const isDisabled =
              !isPlayerTurn || (mustFollowSuit && suit !== leadSuit);

            return (
              <div
                key={index}
                className={`relative group transition-transform duration-300 ${
                  isDisabled
                    ? "cursor-not-allowed brightness-50"
                    : "cursor-pointer"
                }`}
                style={{
                  transform: `rotate(${rotation}deg) translateY(-10px)`,
                  zIndex: index,
                  marginLeft: index === 0 ? 0 : "-30px",
                }}
                onClick={() => {
                  if (!isDisabled) handleClick(card);
                }}
              >
                <div
                  className={`transition-transform duration-300 transform-gpu ${
                    !isDisabled
                      ? "group-hover:scale-110 group-hover:-translate-y-10 group-hover:z-50"
                      : ""
                  }`}
                >
                  <Image
                    src={`/images/card_images/${card}.png`}
                    alt={card}
                    width={100}
                    height={150}
                    className="rounded-xl shadow-lg hover:shadow-2xl"
                    style={{
                      filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25))",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
