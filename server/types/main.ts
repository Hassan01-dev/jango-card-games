import { RungEventType, RungRoom } from "./rung.ts";
import { ThullaEventType, ThullaRoom } from "./thulla.ts";

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
  targetRoom: ThullaRoom | RungRoom;
  roomId: string;
  playerId: string;
  ownerId: string;
  game: GameType;
};

export type AudioMessageType = {
  roomId: string;
  audioKey: string;
};

export type GameType =
  | "thulla"
  | "rung";

export type SecureEventPayload = {
  game: GameType;
  event_type: ThullaEventType | RungEventType;
  data: any;
};
