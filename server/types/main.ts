import { ThullaEventType } from "./thulla.ts";

export type PlayedCard = {
  playerName: string;
  card: string;
  suit: string;
  value: number;
  socketId: string;
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

export type KickPlayerEventData = {
  roomId: string;
  playerId: string;
  ownerId: string;
};

export type AudioMessageType = {
  roomId: string;
  audioKey: string;
};

export type GameType =
  | "thulla";

export type SecureEventPayload = {
  game: GameType;
  event_type: ThullaEventType;
  data: any;
};
