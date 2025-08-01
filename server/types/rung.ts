import { PlayedCard } from "./main.ts";

export type RungRoomCollection = {
  [key: string]: RungRoom;
};

export type RungPlayer = {
  id: string;
  name: string;
  socketId: string;
  cards: string[];
  isWon: boolean;
  team: 'red' | 'blue';
};

export type RungRoom = {
  players: RungPlayer[];
  currentTurn: { id: string; name: string } | null;
  playedCards: PlayedCard[];
  noOfTurns: number;
  isStarted: boolean;
  ownerId: string;
  ownerName: string;
  rungSuit: string;
  redTeamScore: number;
  blueTeamScore: number;
};

export type RungCreateRoomEventData = {
  playerId: string;
  playerName: string;
};

export type RungJoinGameEventData = {
  roomId: string;
  playerName: string;
  playerId: string;
};

export type RungStartGameEventData = {
  roomId: string;
};

export type RungRemovePairsEventData = {
  roomId: string;
  playerId: string;
  removedCards: string[];
};

export type RungEventType =
  | "create_room"
  | "join_game"
  | "game_chat"
  | "start_game"
  | "start_game_with_hidden_card"
  | "won"
  | "kick_player"
  | "audio_message"
  | "remove_pairs";
