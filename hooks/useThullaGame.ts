"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { encryptPayload, decryptPayload } from "@/utils/crypto";
import {
  GameCreatedDataType,
  DecryptedPayload,
  EncryptedPayload,
  OpponentType,
  TurnType,
  StartedRoomJoinedDataType,
  NonStartedRoomJoinedDataType,
  HandReceivedDataType,
  UpdateTurnDataType,
  CardPlayedDataType,
  ThullaDataType,
  CardsTakenDataType,
  GameOverDataType,
  PlayerWonDataType,
  RequestReceivedDataType,
  IMsgDataTypes,
  RequestRejectedDataType,
  ErrorType,
  PlayCardDataType,
  PlayerLeftDataType,
  AutoCardPlayedDataType,
} from "@/utils/types";
import { useSocket } from "./useSocket";
import { toast } from "react-hot-toast";

const useThullaGame = (roomIdParam: string) => {
  const { socket } = useSocket();
  const router = useRouter();

  const [requestData, setRequestData] = useState<RequestReceivedDataType | null>(null);
  const [isRequestReceived, setIsRequestReceived] = useState<boolean>(false);

  const [isUserInfo, setIsUserInfo] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>(roomIdParam);
  const [opponents, setOpponents] = useState<OpponentType[]>([]);
  const [myCards, setMyCards] = useState<string[]>([]);
  const [thullaOccured, setThullaOccured] = useState(false);
  const [playedCards, setPlayedCards] = useState<string[]>([]);
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const [currentTurn, setCurrentTurn] = useState<TurnType>({
    id: "",
    name: "",
  });
  const [nextTurn, setNextTurn] = useState<TurnType>({
    id: "",
    name: "",
  });
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [looser, setLooser] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCardPlayed, setIsCardPlayed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [turnTimer, setTurnTimer] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null); 
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      notificationAudioRef.current = new Audio("/notification.wav");
    }
  }, []);

  useEffect(() => {
    const savedName =
      typeof window !== "undefined" ? localStorage.getItem("playerName") : "";
    if (savedName) setPlayerName(savedName);

    const savedId =
      typeof window !== "undefined" ? localStorage.getItem("playerId") : "";
    if (savedId) setPlayerId(savedId);

    setIsUserInfo(true);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("secure_event", handleEncryptedEvent);
    return () => {
      socket.off("secure_event", handleEncryptedEvent);
    };
  }, [socket]);

  useEffect(() => {
    if (!roomId) return;

    if (currentTurn?.id === playerId) {
      const audio = new Audio("/turn.wav");
      audio.play().catch((e) => console.error("Audio play failed:", e));
    }
  }, [roomId, currentTurn, playerId]);

  useEffect(() => {
    if (gameStarted && !isLoading) {
      startTimer(currentTurn);
    } else {
      stopTimer();
    }
  }, [gameStarted, isLoading, currentTurn]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const emitSecureEvent = async (event_type: string, data: any) => {
    const encrypted = await encryptPayload({ game: "thulla", event_type, data });
    socket?.emit("secure_event", encrypted);
  };

  const handleEncryptedEvent = async (payload: EncryptedPayload) => {
    try {
      const { game, event_type, data } = (await decryptPayload(
        payload
      )) as DecryptedPayload;

      if(game !== "thulla") return;

      switch (event_type) {
        case "game_created":
          handleGameCreated(data as GameCreatedDataType);
          break;
        case "non_started_room_joined":
          handleNonStartedGameJoined(data as NonStartedRoomJoinedDataType);
          break;
        case "game_started":
          toast.success("Game started");
          setGameStarted(true);
          break;
        case "hand_received":
          handleHandReceived(data as HandReceivedDataType);
          break;
        case "started_room_joined":
          handleStartedRoomJoined(data as StartedRoomJoinedDataType);
          break;
        case "player_left":
          handlePlayerLeft(data as PlayerLeftDataType);
          break;
        case "update_turn":
          handleUpdateTurn(data as UpdateTurnDataType);
          break;
        case "card_played":
          handlePlayedCards(data as CardPlayedDataType);
          break;
        case "thulla":
          handleThulla(data as ThullaDataType);
          break;
        case "cards_taken":
          handleCardsTaken(data as CardsTakenDataType);
          break;
        case "empty_table":
          setPlayedCards([]);
          break;
        case "game_over":
          handleGameOver(data as GameOverDataType);
          break;
        case "player_won":
          handlePlayerWon(data as PlayerWonDataType);
          break;
        case "request_received":
          handleRequestReceived(data as RequestReceivedDataType);
          break;
        case "chat_message":
          handleChatMessage(data as IMsgDataTypes);
          break;
        case "request_rejected":
          handleRequestRejected(data as RequestRejectedDataType);
          break;
        case "play_card":
          handlePlayCard(data as PlayCardDataType);
          break;
        case "auto_card_played":
          handleAutoCardPlayed(data as AutoCardPlayedDataType);
          break;
        case "error":
          toast.error((data as ErrorType).message);
          router.replace("/professional_thula");
          break;
        case "player_kicked":
          handlePlayerKicked(data as { players: OpponentType[] });
          break;
        case "kicked":
          toast.error("You have been kicked from the room.");
          router.replace("/professional_thula");
          break;
        case "game_won":
          setIsWinner(true);
          break;
        case "audio_message":
          handleAudioMessage(data as {audioKey: string});
          break;
        default:
          console.warn("Unhandled event_type:", event_type);
      }
    } catch (error) {
      console.error("Failed to decrypt payload:", error);
    }
  };

  // Event Handlers
  const handleAudioMessage = (data: {audioKey: string}) => {
    const { audioKey } = data;
    const audio = new Audio(`/audio/${audioKey}.mp3`);
    audio.play().catch((e) => console.error("Audio play failed:", e));
  };

  const handleGameCreated = (data: GameCreatedDataType) => {
    const { roomId } = data;
    router.push(`/professional_thula/${roomId}`);
  };

  const handlePlayerKicked = (data: { players: OpponentType[] }) => {
    const { players } = data;
    setOpponents(players.filter((p) => p.id !== playerId));
  };

  const handlePlayCard = (data: PlayCardDataType) => {
    const { card } = data;
    setPlayedCards((prev) => [...prev, card]);
  };

  const handleNonStartedGameJoined = ({
    players,
    ownerId,
  }: NonStartedRoomJoinedDataType) => {
    setOpponents(players.map((p) => ({ ...p, cardsCount: 0 })));
    setOwnerId(ownerId);
  };

  const handleHandReceived = ({
    hand,
    opponents,
    currentTurn,
  }: HandReceivedDataType) => {
    setMyCards(hand);
    setOpponents([...opponents, { id: playerId, name: playerName, cardsCount: hand.length }]);
    setCurrentTurn(currentTurn);
    setIsLoading(false);
  };

  const handleStartedRoomJoined = ({
    currentTurn,
  }: StartedRoomJoinedDataType) => {
    setCurrentTurn(currentTurn);
  };

  const handlePlayerLeft = ({
    roomId: leftRoomId,
    playerId,
  }: PlayerLeftDataType) => {
    if (leftRoomId === roomId) {
      setOpponents((prev) => prev.filter((p) => p.id !== playerId));
    }
  };

  const handleUpdateTurn = ({
    currentTurn,
    playersDetail,
    nextTurn,
  }: UpdateTurnDataType) => {
    setCurrentTurn(currentTurn);
    setNextTurn(nextTurn);
    setIsCardPlayed(false);
    setOpponents(playersDetail.filter((p) => p.id !== playerId));
    startTimer(currentTurn);
  };

  const handlePlayedCards = ({ card }: CardPlayedDataType) => {
    setPlayedCards((prev) => [...prev, card]);
  };

  const handleThulla = ({ triggeredBy, looser }: ThullaDataType) => {
    toast.success(`${triggeredBy} caught ${looser} with Thulla!`);
    setThullaOccured(true);
    setPlayedCards([]);
    setTimeout(() => setThullaOccured(false), 3000);
  };

  const handleCardsTaken = ({ cards }: CardsTakenDataType) => {
    setMyCards((prev) => [...prev, ...cards]);
  };

  const handleGameOver = ({ looser }: GameOverDataType) => {
    toast.success(`${looser} lost the game!`);
    setGameOver(true);
    setLooser(looser);
    setMyCards([]);
  };

  const handlePlayerWon = ({ playerName }: PlayerWonDataType) => {
    toast.success(`${playerName} won the game!`);
  };

  const handleRequestReceived = ({
    playerName,
    playerId,
  }: RequestReceivedDataType) => {
    setRequestData({
      playerName,
      playerId,
    });
    setIsRequestReceived(true);
  };

  const handleApproveRequest = () => {
    if(isWinner) return toast.error("You can't approve request when you are winner");

    emitSecureEvent("approve_request_card", {
      roomId,
      requesterPlayerId: requestData?.playerId,
      playerId,
    });
    setIsRequestReceived(false);
    setRequestData(null);
  };

  const handleRejectRequest = () => {
    if(isWinner) return toast.error("You can't reject request when you are winner");

    emitSecureEvent("reject_request_card", {
      roomId,
      playerName,
      requesterPlayerId: requestData?.playerId,
    });
    setIsRequestReceived(false);
    setRequestData(null);
  };

  const handleRequestRejected = ({ playerName }: RequestRejectedDataType) => {
    toast.error(`${playerName} rejected your request`);
  };

  const handleKickPlayer = (kickedPlayerId: string) => {
    emitSecureEvent("kick_player", {
      roomId,
      playerId: kickedPlayerId,
      ownerId,
    });
  };

  // Game Actions

  const createGame = async () => {
    if (!playerName.trim()) return alert("Enter name before creating game");

    const newId = crypto.randomUUID();
    localStorage.setItem("playerId", newId);
    localStorage.setItem("playerName", playerName);

    emitSecureEvent("create_room", { playerId: newId, playerName });
  };

  const joinGame = (roomId: string) => {
    setRoomId(roomId);
    if (!playerName.trim()) return alert("Enter name before joining game");

    const newId = crypto.randomUUID();
    localStorage.setItem("playerId", newId);
    localStorage.setItem("playerName", playerName);
    router.push(`/professional_thula/${roomId}`);
  };

  const emitJoinGame = () => {
    if (!socket || !roomId || !playerName) return;
    emitSecureEvent("join_game", { roomId, playerName, playerId });
  };

  const handleCardPlayed = (card: string) => {
    if(isWinner) return toast.error("You can't play card when you are winner");

    setIsCardPlayed(true);
    const remaining = myCards.filter((c) => c !== card);
    setMyCards(remaining);
    emitSecureEvent("play_card", { roomId, playerName, card, playerId });

    if (currentTurn.id === playerId) {
      stopTimer();
    }
  };

  const handleRequestCard = () => {
    if(isWinner) return toast.error("You can't request card when you are winner");
    emitSecureEvent("request_card", { roomId, playerId });
  }

  const handleStartGame = () => emitSecureEvent("start_game", { roomId });

  const handleSort = (myCards: string[], setMyCards: Function) => {
    const suitOrder = { hearts: 1, clubs: 2, diamonds: 3, spades: 4 };
    const rankOrder = {
      ace: 14,
      king: 13, 
      queen: 12,
      jack: 11,
      10: 10,
      9: 9,
      8: 8,
      7: 7,
      6: 6,
      5: 5,
      4: 4,
      3: 3,
      2: 2
    };
    const sorted = [...myCards].sort((a, b) => {
      const [aRank, , aSuit] = a.split("_");
      const [bRank, , bSuit] = b.split("_");
      const suitDiff =
        suitOrder[aSuit as keyof typeof suitOrder] -
        suitOrder[bSuit as keyof typeof suitOrder];
      if (suitDiff !== 0) return suitDiff;
      
      const aRankValue = rankOrder[aRank.toLowerCase() as keyof typeof rankOrder];
      const bRankValue = rankOrder[bRank.toLowerCase() as keyof typeof rankOrder];
      return bRankValue - aRankValue;
    });
    setMyCards(sorted);
  };

  const emitChatEvent = (msgData: IMsgDataTypes) => {
    emitSecureEvent("game_chat", msgData);
  };

  const handleChatMessage = (data: IMsgDataTypes) => {
    setChat((prev) => [...prev, data]);
    if (data.user !== playerName && notificationAudioRef.current) {
      notificationAudioRef.current.play().catch();
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTurnTimer(0);
  };

const startTimer = (currentTurn: TurnType) => {
  stopTimer();
  setTurnTimer(15);
  timerRef.current = setInterval(() => {
    setTurnTimer(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        const storedPlayerId = localStorage.getItem('playerId');
        if (currentTurn.id === storedPlayerId) {
          emitSecureEvent('auto_play_card', {
            roomId
          });
        }
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

  const handleAutoCardPlayed = (data: AutoCardPlayedDataType) => {
    setMyCards((prev) => prev.filter(card => card !== data.playedCard));
  }

  const handleSendAudioMessage = (audioKey: string) => {
    emitSecureEvent("audio_message", {
      roomId,
      audioKey
    });
  }

  return {
    playerId,
    playerName,
    roomId,
    ownerId,
    opponents,
    myCards,
    thullaOccured,
    playedCards,
    currentTurn,
    gameOver,
    looser,
    isLoading,
    isUserInfo,
    isCardPlayed,
    gameStarted,
    chat,
    isRequestReceived,
    requestData,
    turnTimer,
    isWinner,
    nextTurn,
    createGame,
    joinGame,
    setPlayerName,
    setRoomId,
    setOwnerId,
    setMyCards,
    setOpponents,
    setThullaOccured,
    setPlayedCards,
    setCurrentTurn,
    setGameOver,
    setLooser,
    setIsLoading,
    setIsCardPlayed,
    setGameStarted,
    handleCardPlayed,
    handleSort,
    handleRequestCard,
    handleStartGame,
    emitJoinGame,
    emitChatEvent,
    handleApproveRequest,
    handleRejectRequest,
    handleKickPlayer,
    handleSendAudioMessage
  };
};

export default useThullaGame;
