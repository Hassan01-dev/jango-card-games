"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import GameNotStarted from "./GameNotStarted";
import GameStarted from "./GameStarted";

import {
  handlePlayerLeft,
  handleUpdateTurn,
  handlePlayedCards,
  handleThulla,
  handleCardsTaken,
  handleEmptyTable,
  handleGameOver,
  handlePlayerWon,
  handleSort,
  handleClick,
} from "../actions";

export default function Game({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { socket } = useSocket();
  const playerName = typeof window !== "undefined" ? localStorage.getItem("playerName") || "" : "";
  const playerId = typeof window !== "undefined" ? localStorage.getItem("playerId") || "" : "";
  
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [ownerId, setOwnerId] = useState<string>("");

  const [opponents, setOpponents] = useState<Array<{ id: string, name: string; cardsCount: number }>>([]);
  const [myCards, setMyCards] = useState<string[]>([]);
  const [thullaOccured, setThullaOccured] = useState(false);
  const [playedCards, setPlayedCards] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<{ id: string; name: string }>({ id: "", name: "" });
  const [gameOver, setGameOver] = useState(false);
  const [looser, setLooser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCardPlayed, setIsCardPlayed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => socket.emit("start_game", roomId);  

  useEffect(() => {
    if (!playerName || !playerId) {
      router.replace(`/professional_thula?roomId=${roomId}`);
    }
  }, []);

  const handleNonStartedGameJoined = ({ players, ownerId }: { players: Array<{ id: string; name: string }>; ownerId: string }) => {
    setPlayerNames(players.map(player => player.name));
    setOwnerId(ownerId);
  };

  const handleHandReceived = ({ hand, opponents, currentTurn: { id, name } }: { hand: string[]; opponents: { id: string, name: string; cardsCount: number }[]; currentTurn: { id: string; name: string } }) => {
    setMyCards(hand);
    setOpponents(opponents);
    setCurrentTurn({ id, name });
    setIsLoading(false);
  };

  const handleStartedRoomJoined = ({ currentTurn: { id, name } }: { currentTurn: { id: string; name: string } }) => {
    setCurrentTurn({ id, name });
  };

  const handleRequestCard = () => {
    socket.emit("request_card", { roomId, playerId });
  };

  const handleRequestReceived = ({ playerName, RequesterPlayerId }: { playerName: string, RequesterPlayerId: string }) => {
    if (confirm(`${playerName} has requested for your cards. Do you want to approve?`)) {
      socket.emit('approve_hand_received', { roomId, RequesterPlayerId, playerId });
    }
  };

  useEffect(() => {
    if (!socket || !roomId || !playerName) return;

    socket.emit("join_game", { roomId, playerName, playerId });

    socket.on("error", (error: { message: string }) => {
      toast.error(error.message);
      router.replace('/professional_thula');
    });

    socket.on("non_started_room_joined", handleNonStartedGameJoined);
    socket.on("game_started", () => setGameStarted(true));
    socket.on("hand_received", handleHandReceived);
    socket.on("started_room_joined", handleStartedRoomJoined);
    socket.on("player_left", handlePlayerLeft(roomId, setPlayerNames));
    socket.on("update_turn", handleUpdateTurn(setCurrentTurn, setIsCardPlayed, setOpponents, playerId));
    socket.on("card_played", handlePlayedCards(setPlayedCards));
    socket.on("thulla", handleThulla(setThullaOccured, setPlayedCards));
    socket.on("cards_taken", handleCardsTaken(setMyCards));
    socket.on("empty_table", handleEmptyTable(setPlayedCards));
    socket.on("game_over", handleGameOver(setGameOver, setLooser, setMyCards));
    socket.on("player_won", handlePlayerWon());
    socket.on("request_received", handleRequestReceived);
    return () => {
      socket.off("non_started_room_joined");
      socket.off("started_room_joined");
      socket.off("game_started");
      socket.off("hand_received");

      socket.off("player_left");
      socket.off("update_turn");
      socket.off("card_played");
      socket.off("thulla");
      socket.off("cards_taken");
      socket.off("empty_table");
      socket.off("game_over");
      socket.off("player_won");

      socket.emit("left", { roomId, playerName });
    };
  }, [socket]);

  useEffect(() => {
    if (currentTurn.id === playerId) {
      const audio = new Audio("/turn.wav");
      audio.play().catch((e) => console.error("Audio play failed:", e));
    }
  }, [currentTurn]);

  const playingSuit = playedCards.length > 0 ? playedCards[0].split("_")[2] : "";

  const handleCardPlayed = (card: string) => {
    setIsCardPlayed(true);
    handleClick(card, myCards, setMyCards, socket, roomId, playerName, playerId)
  };

  return gameStarted ? (
    <GameStarted
      roomId={roomId}
      playerId={playerId}
      playingSuit={playingSuit}
      myCards={myCards}
      handleClick={(card) => handleCardPlayed(card)}
      handleSort={() => handleSort(myCards, setMyCards)}
      handleRequestCard={handleRequestCard}
      thullaOccured={thullaOccured}
      playedCards={playedCards}
      currentTurn={currentTurn}
      gameOver={gameOver}
      looser={looser}
      opponents={opponents}
      socket={socket}
      isLoading={isLoading}
      isCardPlayed={isCardPlayed}
    />
  ) : (
    <GameNotStarted playerNames={playerNames} handleStartGame={startGame} playerId={playerId} ownerId={ownerId} />
  );
}
