export type Player = {
  id: string;
  name: string;
  isWon: boolean;
}

export type Room = {
  players: Player[];
  currentTurn: string | null;
  playedCards: PlayedCard[]; // Consider creating a specific type for played cards
  noOfTurns: number;
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
