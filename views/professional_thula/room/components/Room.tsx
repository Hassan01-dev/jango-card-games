"use client";
import { useRouter } from "next/navigation";
import { getCookie, startGame } from "../actions";
import { useEffect, useState } from "react";
import { useSocket } from "@views/professional_thula/hooks/useSocket";

export default function Room({ roomId }: { roomId: string }) {
  const router = useRouter()
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const { socket } = useSocket();

  const handleStartGame = async () => {
    await startGame(roomId, playerNames)
    socket.emit("start_game", roomId);
    router.push(`/professional_thula/game/${roomId}`);
  }


  const joinRoom = async () => {
    const playerName = await getCookie("playerName");
    socket.emit("join_room", { roomId, playerName });
  }

  const handleRoomJoin = (data: {
    roomId: string;
    playerName: string;
    players: Array<{
      id: string;
      name: string;
    }>;
    currentTurn: string;
  }) => {
    if (data.roomId === roomId) {
      setPlayerNames(data.players.map(player => player.name));
    }
  };

  const handlePlayerLeft = ({
    roomId: leftRoomId,
    playerName,
  }: {
    roomId: string;
    playerName: string;
  }) => {
    console.log("leaving")
    if (leftRoomId === roomId) {
      setPlayerNames((pre) => pre.filter((name) => name !== playerName));
    }
  };

  const handleGameStarted = ({ roomId: gameRoomId }: { roomId: string } ) => {
    router.push(`/professional_thula/game/${gameRoomId}`);
  }

  useEffect(() => {
    socket.on("room_joined", handleRoomJoin);
    socket.on("player_left", handlePlayerLeft);
    socket.on("game_started", handleGameStarted);
    joinRoom();

    return () => {
      socket.off("room_joined", handleRoomJoin);
      socket.off("player_left", handlePlayerLeft);
      socket.off("game_started", handleGameStarted);
      const playerName = getCookie("playerName");
      socket.emit("left", { roomId, playerName });
    }
  }, []);

  return (
    <div className="room">
      <div className="room-players">
        {playerNames &&
          playerNames.map((name: string, index: number) => (
            <div key={index} className="player-card">
              {name}
            </div>
          ))}
      </div>
      <div className="create-game-trigger">
        <button onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
