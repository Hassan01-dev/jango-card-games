import { PlayedCard } from "./main.ts";

export const rooms: RoomCollection = {};

export type RoomCollection = {
  [key: string]: Room;
};

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
  isFirstTurn: boolean;
};

export type CreateRoomEventData = {
  playerId: string;
  playerName: string;
};

export type JoinGameEventData = {
  roomId: string;
  playerName: string;
  playerId: string;
};

export type StartGameEventData = {
  roomId: string;
};

export type RequestCardEventData = {
  roomId: string;
  playerId: string;
};

export type ApproveRequestCardEventData = {
  roomId: string;
  requesterPlayerId: string;
  playerId: string;
};

export type RejectRequestCardEventData = {
  roomId: string;
  playerName: string;
  requesterPlayerId: string;
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
  | "approve_request_card"
  | "reject_request_card"
  | "kick_player"
  | "auto_play_card"
  | "audio_message";

export type SecureEventPayload = {
  game: string;
  event_type: EventType;
  data: any;
};
