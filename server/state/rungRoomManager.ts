import { RungRoom, RungRoomCollection } from "../types/rung.ts";

const rungRooms: RungRoomCollection = {};

export const getRungRoom = (roomId: string): RungRoom | undefined => {
  return rungRooms[roomId];
}

export const createRungRoom = (roomId: string, playerId: string, playerName: string): void => {
  const rungSuit = ["hearts", "diamonds", "clubs", "spades"][Math.floor(Math.random() * 4)];
  rungRooms[roomId] = {
    players: [],
    currentTurn: null,
    playedCards: [],
    noOfTurns: 0,
    isStarted: false,
    ownerId: playerId,
    ownerName: playerName,
    rungSuit,
    redTeamScore: 0,
    blueTeamScore: 0,
    noOfCardsOnTable: 0,
    noOfTurnsOnTable: 0,
    lastHighestPlayer: null
  };
};

export const deleteRungRoom = (roomId: string): void => {
  delete rungRooms[roomId];
}

export const getAllRungRooms = (): RungRoomCollection => {
  return rungRooms;
}
