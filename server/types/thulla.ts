import { PlayedCard } from "./main.ts";

export const rooms: ThullaRoomCollection = {};

export type ThullaRoomCollection = {
  [key: string]: ThullaRoom;
};

export type ThullaPlayer = {
  id: string;
  name: string;
  socketId: string;
  cards: string[];
  isWon: boolean;
};

export type ThullaRoom = {
  players: ThullaPlayer[];
  currentTurn: { id: string; name: string } | null;
  playedCards: PlayedCard[];
  noOfTurns: number;
  isStarted: boolean;
  ownerId: string;
  ownerName: string;
  isFirstTurn: boolean;
};

export type ThullaCreateRoomEventData = {
  playerId: string;
  playerName: string;
};

export type ThullaJoinGameEventData = {
  roomId: string;
  playerName: string;
  playerId: string;
};

export type ThullaStartGameEventData = {
  roomId: string;
};

export type ThullaRequestCardEventData = {
  roomId: string;
  playerId: string;
};

export type ThullaApproveRequestCardEventData = {
  roomId: string;
  requesterPlayerId: string;
  playerId: string;
};

export type ThullaRejectRequestCardEventData = {
  roomId: string;
  playerName: string;
  requesterPlayerId: string;
};

export type ThullaEventType =
  | "create_room"
  | "join_game"
  | "game_chat"
  | "play_card"
  | "start_game"
  | "won"
  | "request_card"
  | "approve_request_card"
  | "reject_request_card"
  | "kick_player"
  | "auto_play_card"
  | "audio_message";
