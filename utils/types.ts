export type EventType =
  | "game_created"
  | "non_started_room_joined"
  | "game_started"
  | "hand_received"
  | "started_room_joined"
  | "player_left"
  | "update_turn"
  | "card_played"
  | "thulla"
  | "cards_taken"
  | "empty_table"
  | "game_over"
  | "player_won"
  | "request_received"
  | "error"
  | "chat_message"
  | "request_rejected"
  | "play_card"
  | "player_kicked"
  | "kicked";

export type GameCreatedDataType = {
  roomId: string;
};

export type DecryptedPayload<T = unknown> = {
  event_type: EventType;
  data: T;
};

export type EncryptedPayload = string;

export type OpponentType = {
  id: string;
  name: string;
  cardsCount: number;
};

export type TurnType = {
  id: string;
  name: string;
};

export type NonStartedRoomJoinedDataType = {
  players: { id: string; name: string }[];
  ownerId: string;
};

export type StartedRoomJoinedDataType = {
  currentTurn: TurnType;
};

export type HandReceivedDataType = {
  hand: string[];
  opponents: OpponentType[];
  currentTurn: TurnType;
};

export type UpdateTurnDataType = {
  currentTurn: TurnType;
  playersDetail: OpponentType[];
};

export type CardPlayedDataType = {
  playerName: string;
  card: string;
};

export type ThullaDataType = {
  triggeredBy: string;
  looser: string;
};

export type CardsTakenDataType = {
  cards: string[];
};

export type GameOverDataType = {
  looser: string;
};

export type PlayerWonDataType = {
  playerName: string;
};

export type RequestReceivedDataType = {
  playerName: string;
  playerId: string;
};

export type IMsgDataTypes = {
  roomId: string | number;
  user: string;
  message: string;
  time: string;
}

export type RequestRejectedDataType = {
  playerName: string;
}

export type ErrorType = {
  message: string;
}

export type PlayCardDataType = {
  playerName: string;
  card: string;
}

export type PlayerLeftDataType = { roomId: string; playerName: string, playerId: string }

export type UseGameReturn = {
  playerId: string;
  playerName: string;
  roomId: string;
  joinedPlayerList: string[];
  ownerId: string;
  opponents: OpponentType[];
  myCards: string[];
  thullaOccured: boolean;
  playedCards: string[];
  currentTurn: TurnType;
  gameOver: boolean;
  looser: string;
  isLoading: boolean;
  isUserInfo: boolean;
  isCardPlayed: boolean;
  gameStarted: boolean;
  chat: IMsgDataTypes[];
  isRequestReceived: boolean;
  requestData: RequestReceivedDataType | null;
  turnTimer: number;
  createGame: () => void;
  joinGame: () => void;
  setPlayerName: (name: string) => void;
  setRoomId: (id: string) => void;
  setJoinedPlayerList: (playerList: string[]) => void;
  setOwnerId: (ownerid: string) => void;
  setMyCards: (cards: string[]) => void;
  setOpponents: (opponents: OpponentType[]) => void;
  setThullaOccured: (value: boolean) => void;
  setPlayedCards: (cards: string[]) => void;
  setCurrentTurn: (turn: TurnType) => void;
  setGameOver: (value: boolean) => void;
  setLooser: (loser: string) => void;
  setIsLoading: (value: boolean) => void;
  setIsCardPlayed: (value: boolean) => void;
  setGameStarted: (value: boolean) => void;
  handleCardPlayed: (card: string) => void;
  handleSort: (myCards: string[], setMyCards: Function) => void;
  handleRequestCard: () => void;
  handleStartGame: () => void;
  emitJoinGame: () => void;
  emitChatEvent: (msgData: IMsgDataTypes) => void;
  handleApproveRequest: () => void;
  handleRejectRequest: () => void;
  handleKickPlayer: (kickedPlayerId: string) => void;
};
