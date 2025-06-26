export type Player = {
  id: string;
  name: string;
  socketId: string;
  cards: string[];
  isWon: boolean;
}

export type Room = {
  players: Player[];
  currentTurn: { id: string; name: string } | null;
  playedCards: PlayedCard[];
  noOfTurns: number;
  isStarted: boolean;
  ownerId: string;
  ownerName: string;
}

export type PlayedCard = {
    playerName: string;
    card: string;
    suit: string;
    value: number;
    socketId: string;
}

export type RoomCollection = {
  [key: string]: Room;
}

export const rooms: RoomCollection = {};
