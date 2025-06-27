"use client";

import Image from "next/image";
import GameChat from "./GameChat";
import Confetti from "react-confetti"
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import PlayerCard from "./PlayerCard";

const opponentPositions = [
  { top: "5%", left: "50%", transform: "translate(-50%, 0)" }, // Top
  { top: "15%", left: "80%", transform: "translate(-50%, 0)" }, // Top-Right
  { top: "45%", left: "95%", transform: "translate(-50%, -50%)" }, // Right
  { top: "80%", left: "80%", transform: "translate(-50%, -100%)" }, // Bottom-Right
  { top: "85%", left: "50%", transform: "translate(-50%, -100%)" }, // Bottom (Player)
  { top: "80%", left: "20%", transform: "translate(-50%, -100%)" }, // Bottom-Left
  { top: "45%", left: "5%", transform: "translate(-50%, -50%)" }, // Left
  { top: "15%", left: "20%", transform: "translate(-50%, 0)" }, // Top-Left
];

export default function GameStarted({
  roomId,
  playerId,
  playingSuit,
  myCards,
  handleClick,
  handleSort,
  handleRequestCard,
  thullaOccured,
  playedCards,
  currentTurn,
  gameOver,
  looser,
  opponents,
  socket,
  isLoading,
  isCardPlayed,
}: {
  roomId: string;
  playerId: string;
  playingSuit: string;
  myCards: Array<string>;
  handleClick: (card: string) => void;
  handleSort: (suit: string) => void;
  handleRequestCard: () => void;
  thullaOccured: boolean;
  playedCards: Array<string>;
  currentTurn: { id: string; name: string };
  gameOver: boolean;
  looser: string;
  opponents: Array<{ name: string; cardsCount: number }>;
  socket: Socket;
  isLoading: boolean;
  isCardPlayed: boolean;
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
    <div className="relative w-full h-screen bg-gradient-to-b from-green-950 to-green-800 overflow-hidden">
      {/* Game Table in Center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-green-800 to-green-900 rounded-full shadow-2xl border border-green-600/30 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <div className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Game Table
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/dealing.gif"
              alt="Loading"
              width={200}
              height={200}
              className="rounded-2xl"
            />
          </div>
        )}

        {!gameOver && (
          <div className="relative h-[200px] w-full flex justify-center items-center">
            {playedCards.map((card, index) => (
              <div
                key={index}
                className="absolute transition-all duration-300"
                style={{
                  transform: `rotate(${
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
                  className="rounded-xl shadow-lg hover:shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3))",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {thullaOccured && (
          <div className="mt-4">
            <Image src="/thulla.gif" alt="Thulla" width={120} height={120} />
          </div>
        )}

        {gameOver && (
          <div className="absolute bg-white p-6 rounded-lg shadow-xl z-50">
            <h2 className="text-xl font-bold mb-2">Game Over</h2>
            <p>{looser} lost the game!</p>
          </div>
        )}

        <div className="mt-4 px-4">
          <div className="turn-indicator text-white bg-green-700/50 px-6 py-2 rounded-full shadow">
            <span className="animate-pulse inline-block w-3 h-3 bg-green-400 rounded-full mr-2" />
            {currentTurn.id === playerId ? "Your" : `${currentTurn.name}'s`}{" "}
            Turn
          </div>
        </div>
      </div>

      {/* Opponents Around Table */}
      {opponents.map((opponent, index) => {
        const position = opponentPositions[index];
        if (!position) return null;

        return (
          <div
            key={index}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform,
            }}
          >
            <PlayerCard player={opponent} />
          </div>
        );
      })}

      {/* Player Cards at Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
            {playerName?.[0].toUpperCase()}
          </div>
          <div className="text-white">
            <h3 className="text-lg font-semibold">{playerName}</h3>
            <p className="text-green-300 text-sm">Cards: {myCards.length}</p>
            <button
              onClick={() => handleSort(playingSuit)}
              className="text-sm underline"
            >
              Sort
            </button>
            {false && (
              <div>
                <button onClick={handleRequestCard}>Request Card from Next Player</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center relative min-h-[200px]">
          {myCards.map((card, index) => {
            const middleIndex = Math.floor(myCards.length / 2);
            const rotation = index - middleIndex;
            const [, , suit] = card.split("_");

            const isPlayerTurn = currentTurn.id === playerId;
            const hasLeadSuit = myCards.some(
              (c) => c.split("_")[2] === playingSuit
            );
            const mustFollowSuit = !!playingSuit && hasLeadSuit;
            const isDisabled =
              !isPlayerTurn || (mustFollowSuit && suit !== playingSuit) || isCardPlayed;

            return (
              <div
                key={index}
                className={`relative transition duration-300 ${
                  isDisabled
                    ? "cursor-not-allowed brightness-50"
                    : "cursor-pointer"
                }`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  zIndex: index,
                  marginLeft: index === 0 ? 0 : "-30px",
                }}
                onClick={() => {
                  if (!isDisabled) handleClick(card);
                }}
              >
                <Image
                  src={`/images/card_images/${card}.png`}
                  alt={card}
                  width={100}
                  height={150}
                  className="rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-4 transition-all"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="absolute right-4 bottom-4 w-64">
        <GameChat username={playerName} roomId={roomId} />
      </div>

      {/* Confetti on Thulla */}
      {thullaOccured && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={100}
          gravity={0.5}
        />
      )}
    </div>
  );
}
