import { GulamChorRoom, GulamChorRoomCollection } from "../types/gulamChor.ts";

const gamulChorRooms: GulamChorRoomCollection = {};

export const getGulamChorRoom = (roomId: string): GulamChorRoom | undefined => {
  return gamulChorRooms[roomId];
}

export const createGulamChorRoom = (roomId: string, playerId: string, playerName: string): void => {
  gamulChorRooms[roomId] = {
    players: [],
    currentTurn: null,
    playedCards: [],
    noOfTurns: 0,
    isStarted: false,
    ownerId: playerId,
    removedCard: "",
    ownerName: playerName,
  };
};

export const deleteGulamChorRoom = (roomId: string): void => {
  delete gamulChorRooms[roomId];
}

export const getAllGulamChorRooms = (): GulamChorRoomCollection => {
  return gamulChorRooms;
}
