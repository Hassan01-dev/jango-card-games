export type EventType = "game_created";

export type GameCreatedData = {
  roomId: string;
};

export type DecryptedPayload<T = unknown> = {
  event_type: EventType;
  data: T;
};

export type EncryptedPayload = string;

export type UseGameReturn = {
  playerName: string;
  setPlayerName: (name: string) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  createGame: () => void;
  joinGame: () => void;
}
