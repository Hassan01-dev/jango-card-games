"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GameNotStarted from "./GameNotStarted";

import toast from "react-hot-toast";
import useGulamChorGame from "@/hooks/useGulamChorGame";

export default function Game({ roomId: roomIdParam }: {roomId: string}) {
  const router = useRouter();

  const {
    playerId,
    playerName,
    roomId,
    ownerId,
    opponents,
    isUserInfo,
    handleStartGame,
    emitJoinGame,
    emitChatEvent,
    chat,
    handleKickPlayer,
    handleSendAudioMessage,
  } = useGulamChorGame(roomIdParam);

  useEffect(() => {
    if (!isUserInfo) return;

    if (!playerName || !playerId) {
      toast.error("Please enter your name before joining");
      router.replace(`/gulam_chor?roomId=${roomId}`);
    } else {
      emitJoinGame();
    }
  }, [roomId, playerName, playerId, isUserInfo]);

  return <GameNotStarted
    opponents={opponents}
    handleStartGame={handleStartGame}
    playerId={playerId}
    ownerId={ownerId}
    playerName={playerName}
    roomId={roomId}
    chat={chat}
    emitChatEvent={emitChatEvent}
    handleKickPlayer={handleKickPlayer}
    handleSendAudioMessage={handleSendAudioMessage}
  />

  // return gameStarted ? (
  //   <GameStarted
  //     roomId={roomId}
  //     playerId={playerId}
  //     playingSuit={playingSuit}
  //     myCards={myCards}
  //     handleCardPlayed={handleCardPlayed}
  //     handleSort={() => handleSort(myCards, setMyCards)}
  //     handleRequestCard={handleRequestCard}
  //     thullaOccured={thullaOccured}
  //     playedCards={playedCards}
  //     currentTurn={currentTurn}
  //     gameOver={gameOver}
  //     looser={looser}
  //     opponents={opponents}
  //     isLoading={isLoading}
  //     isCardPlayed={isCardPlayed}
  //     emitChatEvent={emitChatEvent}
  //     chat={chat}
  //     isRequestReceived={isRequestReceived}
  //     handleApproveRequest={handleApproveRequest}
  //     handleRejectRequest={handleRejectRequest}
  //     requestData={requestData}
  //     turnTimer={turnTimer}
  //     handleKickPlayer={handleKickPlayer}
  //     ownerId={ownerId}
  //     nextTurn={nextTurn}
  //     isWinner={isWinner}
  //     handleSendAudioMessage={handleSendAudioMessage}
  //   />
  // ) : (
  //   <GameNotStarted
  //     opponents={opponents}
  //     handleStartGame={handleStartGame}
  //     playerId={playerId}
  //     ownerId={ownerId}
  //     playerName={playerName}
  //     roomId={roomId}
  //     chat={chat}
  //     emitChatEvent={emitChatEvent}
  //     handleKickPlayer={handleKickPlayer}
  //     handleSendAudioMessage={handleSendAudioMessage}
  //   />
  // );
}
