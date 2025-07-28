import { PlayedCard } from "./main.ts";

export const rooms: GulamChorRoomCollection = {};

export type GulamChorRoomCollection = {
  [key: string]: GulamChorRoom;
};

export type GulamChorPlayer = {
  id: string;
  name: string;
  socketId: string;
  cards: string[];
  isWon: boolean;
};

export type GulamChorRoom = {
  players: GulamChorPlayer[];
  currentTurn: { id: string; name: string } | null;
  playedCards: PlayedCard[];
  noOfTurns: number;
  isStarted: boolean;
  ownerId: string;
  ownerName: string;
  removedCard: string;
};

export type GulamChorCreateRoomEventData = {
  playerId: string;
  playerName: string;
};

export type GulamChorJoinGameEventData = {
  roomId: string;
  playerName: string;
  playerId: string;
};

export type GulamChorStartGameEventData = {
  roomId: string;
};

export type GulamChorEventType =
  | "create_room"
  | "join_game"
  | "game_chat"
  | "start_game"
  | "start_game_with_hidden_card"
  | "won"
  | "kick_player"
  | "audio_message";
