"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GameNotStarted from "./GameNotStarted";
import GameStarted from "./GameStarted";

import toast from "react-hot-toast";
import useRungGame from "@/hooks/useRungGame";

export default function Game({ roomId: roomIdParam }: {roomId: string}) {
  const router = useRouter();

  const {
    gameStarted,
    playerId,
    playerName,
    roomId,
    ownerId,
    opponents,
    isUserInfo,
    myCards,
    playedCards,
    currentTurn,
    gameOver,
    looser,
    isLoading,
    isCardPlayed,
    turnTimer,
    nextTurn,
    isWinner,
    handleCardPlayed,
    handleStartGame,
    handleStartGameWithHiddenCard,
    emitJoinGame,
    emitChatEvent,
    chat,
    handleKickPlayer,
    handleSendAudioMessage,
    handleRemovePairs
  } = useRungGame(roomIdParam);

  useEffect(() => {
    if (!isUserInfo) return;

    if (!playerName || !playerId) {
      toast.error("Please enter your name before joining");
      router.replace(`/rung?roomId=${roomId}`);
    } else {
      emitJoinGame();
    }
  }, [roomId, playerName, playerId, isUserInfo]);

  return gameStarted ? (
    <GameStarted
      roomId={roomId}
      playerId={playerId}
      myCards={myCards}
      handleCardPlayed={handleCardPlayed}
      playedCards={playedCards}
      currentTurn={currentTurn}
      gameOver={gameOver}
      looser={looser}
      opponents={opponents}
      isLoading={isLoading}
      isCardPlayed={isCardPlayed}
      emitChatEvent={emitChatEvent}
      chat={chat}
      turnTimer={turnTimer}
      handleKickPlayer={handleKickPlayer}
      ownerId={ownerId}
      nextTurn={nextTurn}
      isWinner={isWinner}
      handleSendAudioMessage={handleSendAudioMessage}
      handleRemovePairs={handleRemovePairs}
    />
  ) : (
    <GameNotStarted
      opponents={opponents}
      handleStartGame={handleStartGame}
      handleStartGameWithHiddenCard={handleStartGameWithHiddenCard}
      playerId={playerId}
      ownerId={ownerId}
      playerName={playerName}
      roomId={roomId}
      chat={chat}
      emitChatEvent={emitChatEvent}
      handleKickPlayer={handleKickPlayer}
      handleSendAudioMessage={handleSendAudioMessage}
    />
  );
}
