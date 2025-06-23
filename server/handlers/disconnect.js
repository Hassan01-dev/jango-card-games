const { getAllRooms, deleteRoom } = require("../state/roomManager");

function handleDisconnect(socket, io) {
  socket.on("disconnect", () => {
    try {
      console.log("User disconnected:", socket.id);

      const rooms = getAllRooms();

      for (const roomId in rooms) {
        const room = rooms[roomId];
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);

        if (playerIndex !== -1) {
          const playerName = room.players[playerIndex].name;
          room.players.splice(playerIndex, 1);

          if (room.currentTurn === socket.id) {
            room.currentTurn = room.players[0]?.id ?? null;
          }

          io.to(roomId).emit("player_left", {
            roomId,
            playerName,
            players: room.players,
            currentTurn: room.currentTurn,
          });

          if (room.players.length === 0) {
            deleteRoom(roomId);
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error in disconnect handler:", error);
    }
  });
}

module.exports = handleDisconnect;
