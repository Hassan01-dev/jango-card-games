const rooms = {};

function getRoom(roomId) {
  return rooms[roomId];
}

function createRoom(roomId) {
  rooms[roomId] = {
    players: [],
    currentTurn: null,
    playedCards: null,
  };
}

function deleteRoom(roomId) {
  delete rooms[roomId];
}

function getAllRooms() {
  return rooms;
}

module.exports = {
  rooms,
  getRoom,
  createRoom,
  deleteRoom,
  getAllRooms,
};
