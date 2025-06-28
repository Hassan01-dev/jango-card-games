// hooks/useGame.ts
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { encryptPayload, decryptPayload } from "@/utils/crypto";
import {
  UseGameReturn,
  GameCreatedData,
  DecryptedPayload,
  EncryptedPayload,
} from "@/utils/types";
import { useSocket } from "./useSocket";

const useGame = (): UseGameReturn => {
  const { socket } = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [playerName, setPlayerName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    const savedName =
      typeof window !== "undefined" ? localStorage.getItem("playerName") : "";
    if (savedName) setPlayerName(savedName);

    const queryRoomId = searchParams.get("roomId");
    if (queryRoomId) setRoomId(queryRoomId);
  }, [searchParams]);

  useEffect(() => {
    if (!socket) return;

    socket.on("secure_event", handleEncryptedEvent);
    return () => {
      socket.off("secure_event", handleEncryptedEvent);
    };
  }, [socket]);

  const handleEncryptedEvent = async (payload: EncryptedPayload) => {
    try {
      const decrypted = (await decryptPayload(payload)) as DecryptedPayload;

      switch (decrypted.event_type) {
        case "game_created": {
          handleGameCreated(decrypted);
          break;
        }

        default:
          console.warn("Unhandled event_type:", decrypted.event_type);
      }
    } catch (error) {
      console.error("Failed to decrypt payload:", error);
    }
  };

  const handleGameCreated = (decrypted: DecryptedPayload) => {
    const gameData = decrypted.data as GameCreatedData;
    router.push(`/professional_thula/${gameData.roomId}`);
  };

  const createGame = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name before creating a game");
      return;
    }

    const playerId = crypto.randomUUID();
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerId", playerId);

    const encrypted = await encryptPayload({
      event_type: "create_room",
      data: { playerId, playerName },
    });

    socket?.emit("secure_event", encrypted);
  };

  const joinGame = () => {
    if (!playerName.trim()) {
      alert("Please enter your name before joining a game");
      return;
    }

    const playerId = crypto.randomUUID();
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerId", playerId);

    router.push(`/professional_thula/${roomId}`);
  };

  return {
    playerName,
    setPlayerName,
    roomId,
    setRoomId,
    createGame,
    joinGame,
  };
};

export default useGame;
