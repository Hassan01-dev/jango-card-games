"use client";

import Image from "next/image";
import GameChat from "./GameChat";
import Confetti from "react-confetti";
import { useEffect } from "react";
import { IMsgDataTypes, OpponentType } from "@/utils/types";
import { cn } from "@/lib/utils";

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
  isLoading,
  isCardPlayed,
  emitChatEvent,
  chat,
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
  opponents: OpponentType[];
  isLoading: boolean;
  isCardPlayed: boolean;
  emitChatEvent: (msgData: IMsgDataTypes) => void;
  chat: IMsgDataTypes[];
}) {
  const playerName =
    typeof window !== "undefined"
      ? localStorage.getItem("playerName") || ""
      : "";

  useEffect(() => {
    if (thullaOccured) {
      const audio = new Audio("/thulla.wav");
      audio.play();
    }
  }, [thullaOccured]);

  const radius = 270;
  const angleStep = 360 / Math.max(opponents.length, 1);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-green-950 to-green-800 overflow-hidden">
      {/* Game Table in Center */}
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-green-800 to-green-900 rounded-full shadow-2xl border border-green-600/30 backdrop-blur-sm flex flex-col items-center justify-center z-10">
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
                    filter:
                      "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3))",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {thullaOccured && (
          <Image
            src="/thulla.gif"
            alt="Thulla"
            width={200}
            height={200}
            className="mt-4"
          />
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
            {currentTurn.id === playerId ? "Your" : `${currentTurn.name}'s`} Turn
          </div>
        </div>
      </div>

      {/* Opponents Around Table */}
      {opponents.map((opponent, index) => {
        const angle = angleStep * index - 90;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(40% + ${y}px)`, // match table center
            }}
          >
            <div className={cn("bg-green-700 text-white px-3 py-2 rounded-xl shadow-lg w-32", currentTurn.id === opponent.id && "ring-2 ring-yellow-400 animate-pulse")}>
              <div className="font-semibold truncate">{opponent.name}</div>
              <div className="text-sm text-green-200">
                Cards: {opponent.cardsCount}
              </div>
            </div>
          </div>
        );
      })}

      {/* Player Cards at Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
        <div className="flex items-center gap-4 mb-2">
          <div className={cn(
              "w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold text-white",
              currentTurn.id === playerId && "ring-2 ring-yellow-400 animate-pulse"
            )}>
            {playerName?.[0]?.toUpperCase()}
          </div>
          <div className="text-white">
            <h3 className="text-lg font-semibold">{playerName}</h3>
            <p className="text-green-300 text-sm">
              Cards: {myCards.length}
            </p>
            <button
              onClick={() => handleSort(playingSuit)}
              className="text-sm underline"
            >
              Sort
            </button>
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
              !isPlayerTurn ||
              (mustFollowSuit && suit !== playingSuit) ||
              isCardPlayed;

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
      <div className="absolute right-4 bottom-4 w-76">
        <GameChat
          playerName={playerName}
          roomId={roomId}
          chat={chat}
          emitChatEvent={emitChatEvent}
        />
      </div>

      {/* Confetti on Thulla */}
      {thullaOccured && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1000}
          height={typeof window !== "undefined" ? window.innerHeight : 800}
          recycle={false}
          numberOfPieces={100}
          gravity={0.5}
        />
      )}
    </div>
  );
}
