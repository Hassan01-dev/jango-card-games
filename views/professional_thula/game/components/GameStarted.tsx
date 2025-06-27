"use client";

import Image from "next/image";
import GameChat from "./GameChat";
import Confetti from "react-confetti"
import { useEffect } from "react";
import { Socket } from "socket.io-client";

export default function GameStarted({
  roomId,
  playerId,
  playingSuit,
  myCards,
  handleClick,
  handleSort,
  thullaOccured,
  playedCards,
  currentTurn,
  gameOver,
  looser,
  opponents,
  socket
}: {
  roomId: string;
  playerId: string;
  playingSuit: string;
  myCards: Array<string>;
  handleClick: (card: string) => void;
  handleSort: (suit: string) => void;
  thullaOccured: boolean;
  playedCards: Array<string>;
  currentTurn: { id: string; name: string };
  gameOver: boolean;
  looser: string;
  opponents: Array<{ name: string; cardsCount: number }>;
  socket: Socket;
}) {
  const playerName = localStorage.getItem("playerName") || "";


useEffect(() => {
  if (thullaOccured) {
    // Play audio
    const audio = new Audio("/thulla.wav");
    audio.play();
  }
}, [thullaOccured]);


  useEffect(() => {
    const handlePlayAudio = () => {
      console.log("Play Audio")
      const audio = new Audio("/secret_audio.mp3");
      audio.play().catch((e) => console.error("Audio play failed:", e));
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        socket.emit("secret_event", roomId);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    socket.on("play_audio", handlePlayAudio);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      socket.off("play_audio", handlePlayAudio);
    };
  }, []);

  return (
    <div className="professional-thula h-screen flex bg-gradient-to-b from-green-950 to-green-800 p-4">
      <div className="opposition grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {opponents.map((opponent, index) => (
          <div
            key={index}
            className="bg-green-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-white shadow-xl border border-green-600/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                {opponent.name[0].toUpperCase()}
              </div>
              <h3 className="text-base sm:text-lg font-semibold">
                {opponent.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-green-300 text-sm sm:text-base">
              <span>Cards:</span>
              <span className="font-bold">{opponent.cardsCount}</span>
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
          {currentTurn.id === playerId ? "Your" : `${currentTurn.name}'s`} Turn
        </div>

        {/* Played Cards */}
        {!gameOver && (
          <div className="w-full flex flex-col items-center">
            <div className="played-cards relative h-[200px] sm:h-[250px]">
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
            {thullaOccured && (
              <div className="animate-[fadeOut_2s_ease-in-out]">
                <Image
                  src="/thulla.gif"
                  alt="Waiting animation"
                  width={120}
                  height={120}
                  className="z-10"
                />
              </div>
            )}
          </div>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Game Over</h2>
            <p className="text-lg">
              {looser} lost the game!
            </p>
          </div>
        )}

        {/* Chat */}
        <div className="chat-area rounded-2xl p-4">
          <GameChat username={playerName} roomId={roomId} />
        </div>
      </div>

      {/* Player Cards */}
      <div className="player-cards mt-6 sm:mt-10 bg-green-800/40 rounded-2xl p-4 backdrop-blur-sm border border-green-600/30">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
            {playerName?.[0].toUpperCase()}
          </div>
          <div className="text-white">
            <h3 className="text-base sm:text-xl font-semibold">
              {playerName}
            </h3>
            <div className="flex items-center gap-2 text-green-300 text-sm sm:text-base">
              <span>Cards Remaining:</span>
              <span className="font-bold">{myCards.length}</span>
            </div>
            <div>
              <button onClick={() => handleSort(playingSuit)}>Sort</button>
            </div>
          </div>
        </div>

        <div className="ml-8 relative flex justify-center items-end min-h-[200px] sm:min-h-[220px] px-4 sm:px-0">
          {myCards.map((card: string, index: number) => {
            const middleIndex = Math.floor(myCards.length / 2);
            const rotation = index - middleIndex;
            const [, , suit] = card.split("_");

            const isPlayerTurn = currentTurn.id === playerId;
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
      { thullaOccured && <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={100}
        gravity={0.5} 
        />
      }
    </div>
  );
}
