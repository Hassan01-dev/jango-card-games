import { Room, RoomCollection } from "../utils/types.ts";

const rooms: RoomCollection = {};

export const getRoom = (roomId: string): Room | undefined => {
  return rooms[roomId];
}

export const createRoom = (roomId: string): Room => {
  rooms[roomId] = {
    players: [],
    currentTurn: null,
    playedCards: [],
    noOfTurns: 0,
  };
  return rooms[roomId];
}

export const deleteRoom = (roomId: string): void => {
  delete rooms[roomId];
}

export const getAllRooms = (): RoomCollection => {
  return rooms;
}

