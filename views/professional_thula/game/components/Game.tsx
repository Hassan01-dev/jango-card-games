"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameNotStarted from "./GameNotStarted";
import GameStarted from "./GameStarted";

import useGame from "@/hooks/useGame";

export default function Game({ roomId: roomIdParam }: {roomId: string}) {
  const router = useRouter();

  const {
    playerId,
    playerName,
    roomId,
    joinedPlayerList,
    ownerId,
    currentTurn,
    playedCards,
    myCards,
    setMyCards,
    handleCardPlayed,
    handleSort,
    handleRequestCard,
    thullaOccured,
    gameOver,
    looser,
    opponents,
    isLoading,
    isCardPlayed,
    gameStarted,
    handleStartGame,
    emitJoinGame,
    emitChatEvent,
    chat,
    isRequestReceived,
    handleApproveRequest,
    handleRejectRequest,
    requestData
  } = useGame(roomIdParam);

  console.log("Played Cards:", playedCards)

  useEffect(() => {
    if (isLoading) return;

    if (!playerName || !playerId) {
      router.replace(`/professional_thula?roomId=${roomId}`);
    } else {
      emitJoinGame();
    }
  }, [roomId, playerName, playerId]);

  const playingSuit =
    playedCards.length > 0 ? playedCards[0].split("_")[2] : "";

  return gameStarted ? (
    <GameStarted
      roomId={roomId}
      playerId={playerId}
      playingSuit={playingSuit}
      myCards={myCards}
      handleCardPlayed={handleCardPlayed}
      handleSort={() => handleSort(myCards, setMyCards)}
      handleRequestCard={handleRequestCard}
      thullaOccured={thullaOccured}
      playedCards={playedCards}
      currentTurn={currentTurn}
      gameOver={gameOver}
      looser={looser}
      opponents={opponents}
      isLoading={isLoading}
      isCardPlayed={isCardPlayed}
      emitChatEvent={emitChatEvent}
      chat={chat}
      isRequestReceived={isRequestReceived}
      handleApproveRequest={handleApproveRequest}
      handleRejectRequest={handleRejectRequest}
      requestData={requestData}
    />
  ) : (
    <GameNotStarted
      playerNames={joinedPlayerList}
      handleStartGame={handleStartGame}
      playerId={playerId}
      ownerId={ownerId}
      playerName={playerName}
      roomId={roomId}
      chat={chat}
      emitChatEvent={emitChatEvent}
    />
  );
}
