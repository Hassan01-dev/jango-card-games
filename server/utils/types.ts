export type Player = {
  id: string;
  name: string;
  socketId: string;
  cards: string[];
  isWon: boolean;
};

export type Room = {
  players: Player[];
  currentTurn: { id: string; name: string } | null;
  playedCards: PlayedCard[];
  noOfTurns: number;
  isStarted: boolean;
  ownerId: string;
  ownerName: string;
};

export type PlayedCard = {
  playerName: string;
  card: string;
  suit: string;
  value: number;
  socketId: string;
  playerId: string;
};

export type RoomCollection = {
  [key: string]: Room;
};

export const rooms: RoomCollection = {};

export type CreateRoomEventData = {
  playerId: string;
  playerName: string;
};

export type JoinGameEventData = {
  roomId: string;
  playerName: string;
  playerId: string;
};

export type GameChatEventData = {
  roomId: string;
  message: string;
  user: string;
  time: string;
};

export type PlayCardEventData = {
  roomId: string;
  card: string;
  playerName: string;
  playerId: string;
};

export type StartGameEventData = {
  roomId: string;
};

export type WonEventData = {
  roomId: string;
  playerName: string;
};

export type RequestCardEventData = {
  roomId: string;
  playerId: string;
};

export type ApproveRequestCardEventData = {
  roomId: string;
  RequesterPlayerId: string;
  playerId: string;
};
export type EventType =
  | "create_room"
  | "join_game"
  | "game_chat"
  | "play_card"
  | "disconnect"
  | "start_game"
  | "won"
  | "request_card"
  | "approve_request_card";

export type SecureEventPayload = {
  event_type: EventType;
  data: any;
};
