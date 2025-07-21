import { ThullaRoom, ThullaRoomCollection } from "../types/thulla.ts";

const thullaRooms: ThullaRoomCollection = {};

export const getThullaRoom = (roomId: string): ThullaRoom | undefined => {
  return thullaRooms[roomId];
}

export const createThullaRoom = (roomId: string, playerId: string, playerName: string): void => {
  thullaRooms[roomId] = {
    players: [],
    currentTurn: null,
    playedCards: [],
    noOfTurns: 0,
    isStarted: false,
    isFirstTurn: true,
    ownerId: playerId,
    ownerName: playerName,
  };
};

export const deleteThullaRoom = (roomId: string): void => {
  delete thullaRooms[roomId];
}

export const getAllThullaRooms = (): ThullaRoomCollection => {
  return thullaRooms;
}
