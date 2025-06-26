"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "@views/professional_thula/hooks/useSocket";

export default function RoomComponent({ roomId }: { roomId: string }) {
  const router = useRouter()
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const { socket } = useSocket();

  const handleStartGame = async () => {
    // await startGame(roomId, playerNames)
    socket.emit("start_game", roomId);
    router.push(`/professional_thula/game/${roomId}`);
  }

  const joinRoom = async () => {
    const playerName = localStorage.getItem("playerName");
    socket.emit("join_room", { roomId, playerName });
  }

  const handleRoomJoin = ({ players }: {
    players: Array<{
      id: string;
      name: string;
    }>;
  }) => {
    setPlayerNames(players.map(player => player.name));
  };

  const handlePlayerLeft = ({
    roomId: leftRoomId,
    playerName,
  }: {
    roomId: string;
    playerName: string;
  }) => {
    if (leftRoomId === roomId) {
      setPlayerNames((pre) => pre.filter((name) => name !== playerName));
    }
  };

  const handleGameStarted = ({ roomId: gameRoomId }: { roomId: string } ) => {
    router.push(`/professional_thula/game/${gameRoomId}`);
  }

  // const handleHandReceived = ({ hand }: { hand: string[] }) => {
  //   console.log(hand)
  // };

  useEffect(() => {
    socket.on("room_joined", handleRoomJoin);
    socket.on("player_left", handlePlayerLeft);
    socket.on("game_started", handleGameStarted);
    // socket.on("hand_received", handleHandReceived)

    joinRoom();

    return () => {
      socket.off("room_joined", handleRoomJoin);
      socket.off("player_left", handlePlayerLeft);
      socket.off("game_started", handleGameStarted);
      // socket.off("hand_received", handleHandReceived)

      const playerName = localStorage.getItem("playerName");
      socket.emit("left", { roomId, playerName });
    }
  }, [roomId]);

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
