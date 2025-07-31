import { RungRoom, RungRoomCollection } from "../types/rung.ts";

const gamulChorRooms: RungRoomCollection = {};

export const getRungRoom = (roomId: string): RungRoom | undefined => {
  return gamulChorRooms[roomId];
}

export const createRungRoom = (roomId: string, playerId: string, playerName: string): void => {
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

export const deleteRungRoom = (roomId: string): void => {
  delete gamulChorRooms[roomId];
}

export const getAllRungRooms = (): RungRoomCollection => {
  return gamulChorRooms;
}
