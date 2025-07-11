"use client";

import Image from "next/image";
import GameChat from "../components/GameChat";
import Confetti from "react-confetti";
import { useEffect } from "react";
import {
  IMsgDataTypes,
  OpponentType,
  RequestReceivedDataType,
  TurnType,
} from "@/utils/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function GameStarted({
  roomId,
  playerId,
  playingSuit,
  myCards,
  handleCardPlayed,
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
  isRequestReceived,
  handleApproveRequest,
  handleRejectRequest,
  requestData,
  turnTimer,
  handleKickPlayer,
  ownerId,
  nextTurn,
  isWinner,
  handleSendAudioMessage
}: {
  roomId: string;
  playerId: string;
  playingSuit: string;
  myCards: Array<string>;
  handleCardPlayed: (card: string) => void;
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
  isRequestReceived: boolean;
  handleApproveRequest: () => void;
  handleRejectRequest: () => void;
  requestData: RequestReceivedDataType | null;
  turnTimer: number;
  handleKickPlayer: (playerId: string) => void;
  ownerId: string;
  nextTurn: TurnType;
  isWinner: boolean;
  handleSendAudioMessage: (key: string) => void;
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
  const isOwner = playerId === ownerId;

  return (
    <>
      <div className="relative w-full h-screen grid grid-rows-[9fr_3fr]">
        {/* Top Section: Game Table + Chat */}
        <div className="grid grid-cols-[10fr_2fr] w-full h-full px-9">
          {/* Game Table */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-[400px] h-[400px]">
              <div className="w-full h-full bg-white/10 rounded-full shadow-2xl border border-white/20 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Game Table
                </div>

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
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

                <div className="mt-6 px-6">
                  <div className="relative turn-indicator text-white  px-8 py-3 rounded-full shadow-lg backdrop-blur-sm border border-emerald-500/20">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-white/10 to-white/20 rounded-full transition-all duration-1000 ease-in-out"
                      style={{
                        width: `${(turnTimer / 15) * 100}%`,
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center font-medium tracking-wide">
                      <span className="animate-pulse inline-block w-3 h-3 bg-white/60 rounded-full mr-3 shadow-lg shadow-white/80" />
                      <span className="text-emerald-50">
                        {currentTurn.id === playerId
                          ? "Your"
                          : `${currentTurn.name}'s`}{" "}
                        Turn
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opponents */}
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
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    <div
                      className={cn(
                        "bg-white/20 text-white px-3 py-2 rounded-xl shadow-lg w-32",
                        currentTurn.id === opponent.id &&
                          "ring-2 ring-yellow-400 animate-pulse"
                      )}
                    >
                      <div className="font-semibold truncate">
                        {opponent.name}
                      </div>
                      <div className="text-sm text-white">
                        Cards: {opponent.cardsCount}
                      </div>
                      {isOwner && opponent.id !== ownerId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleKickPlayer(opponent.id)}
                          className="cursor-pointer"
                        >
                          <Image
                            src="/kick.svg"
                            alt="Kick"
                            width={20}
                            height={20}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex items-center justify-center">
            <GameChat
              playerName={playerName}
              roomId={roomId}
              chat={chat}
              emitChatEvent={emitChatEvent}
              handleSendAudioMessage={handleSendAudioMessage}
            />
          </div>
        </div>

        {!isWinner && (
          <div className="grid grid-cols-[2fr_10fr] w-full py-2 px-16">
            {/* Player Info + Actions - Left Side */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold text-white",
                    currentTurn.id === playerId &&
                      "ring-2 ring-yellow-400 animate-pulse"
                  )}
                >
                  {playerName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-white">
                    <h3 className="text-lg font-semibold">{playerName}</h3>
                    <p className="text-white/60 text-sm">
                      Cards: {myCards.length}
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSort(playingSuit)} className="w-fit">
                Sort
              </Button>

              {(opponents.find((op) => op.id === nextTurn.id)?.cardsCount ||
                6) < 5 &&
                !isLoading && (
                  <Button onClick={handleRequestCard} className="w-fit">
                    Request Card
                  </Button>
                )}
            </div>

            {/* Player Cards - Right Side */}
            <div className="flex">
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
                      if (!isDisabled) handleCardPlayed(card);
                    }}
                  >
                    <Image
                      src={`/images/card_images/${card}.png`}
                      alt={card}
                      width={100}
                      height={150}
                      className="rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-4 transition-all"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Request Dialog */}
      <Dialog open={isRequestReceived && requestData !== null}>
        <DialogContent className="z-[9999]">
          <DialogHeader className="text-center">
            <DialogTitle>Request Received</DialogTitle>
            <DialogDescription>
              {requestData?.playerName} requested for your cards
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 pt-4">
            <Button variant="default" onClick={handleApproveRequest}>
              Confirm
            </Button>
            <Button variant="outline" onClick={handleRejectRequest}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confetti */}
      {thullaOccured && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1000}
          height={typeof window !== "undefined" ? window.innerHeight : 800}
          recycle={false}
          numberOfPieces={100}
          gravity={0.5}
        />
      )}
    </>
  );
}
