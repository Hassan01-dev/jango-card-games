import { toast } from "react-hot-toast";

export const handlePlayerLeft = (roomId: string, setPlayerNames: Function) => ({ roomId: leftRoomId, playerName }: { roomId: string; playerName: string }) => {
  if (leftRoomId === roomId) {
    setPlayerNames((prev: string[]) => prev.filter(name => name !== playerName));
  }
};

export const handleUpdateTurn =
  (
    setCurrentTurn: Function,
    setIsCardPlayed: Function,
    setOpponents: Function,
    playerId: string
  ) =>
  ({
    currentTurn: { id, name },
    playersDetail,
  }: {
    currentTurn: { id: string; name: string };
    playersDetail: { id: string; name: string; cardsCount: number }[];
  }) => {
    setCurrentTurn({ id, name });
    setIsCardPlayed(false);
    setOpponents(playersDetail.filter((p) => p.id !== playerId));
  };

export const handlePlayedCards = (setPlayedCards: Function) => ({ card }: { playerName: string; card: string }) => {
  setPlayedCards((prev: string[]) => [...prev, card]);
};

export const handleThulla = (setThullaOccured: Function, setPlayedCards: Function) => ({
  triggeredBy,
  looser,
}: {
  triggeredBy: string;
  looser: string;
}) => {
  toast.success(`${triggeredBy} caught ${looser} with Thulla!`);
  setThullaOccured(true);
  setPlayedCards([]);
  setTimeout(() => setThullaOccured(false), 3000);
};

export const handleCardsTaken = (setMyCards: Function) => ({ cards }: { cards: string[] }) => {
  setMyCards((prev: string[]) => [...prev, ...cards]);
};

export const handleEmptyTable = (setPlayedCards: Function) => () => {
  setPlayedCards([]);
};

export const handleGameOver = (setGameOver: Function, setLooser: Function, setMyCards: Function) => ({ looser }: { looser: string }) => {
  toast.success(`${looser} lost the game!`);
  setGameOver(true);
  setLooser(looser);
  setMyCards([]);
};

export const handlePlayerWon = () => ({ playerName }: { playerName: string }) => {
  toast.success(`${playerName} won the game!`);
};

export const handleSort = (myCards: string[], setMyCards: Function) => {
  const suitOrder = { hearts: 1, clubs: 2, diamonds: 3, spades: 4 };
  const sorted = [...myCards].sort((a, b) => {
    const [aRank, , aSuit] = a.split("_");
    const [bRank, , bSuit] = b.split("_");
    const suitDiff = suitOrder[aSuit as keyof typeof suitOrder] - suitOrder[bSuit as keyof typeof suitOrder];
    return suitDiff !== 0 ? suitDiff : parseInt(aRank) - parseInt(bRank);
  });
  setMyCards(sorted);
};

export const handleClick = (
  card: string,
  myCards: string[],
  setMyCards: Function,
  socket: any,
  roomId: string,
  playerName: string,
  playerId: string
) => {
  const remaining = myCards.filter((c) => c !== card);
  setMyCards(remaining);
  socket.emit("play_card", { roomId, playerName, card, playerId });
  if (remaining.length === 0) {
    socket.emit("won", { roomId, playerName });
  }
};
