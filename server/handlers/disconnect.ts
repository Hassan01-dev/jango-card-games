import { deleteRoom, getAllRooms } from "../state/roomManager.ts";


export function handleDisconnect(socket: any, io: any) {
  socket.on("disconnect", () => {
    try {
      const rooms = getAllRooms();

      for (const roomId in rooms) {
        const room = rooms[roomId];
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);

        if (playerIndex !== -1) {
          const playerName = room.players[playerIndex].name;
          if (!room.isStarted) {
            room.players.splice(playerIndex, 1);
          }

          if (room.currentTurn?.id === socket.id) {
            const player = room.players[0]
            room.currentTurn = player ? { id: player.id, name: player.name } : null;
          }

          io.to(roomId).emit("player_left", {
            roomId,
            playerName,
            players: room.players,
            currentTurn: room.currentTurn,
          });

          // if (room.players.length === 0) {
          //   deleteRoom(roomId);
          // }
          // break;
        }
      }
    } catch (error) {
      console.error("Error in disconnect handler:", error);
    }
  });
}
