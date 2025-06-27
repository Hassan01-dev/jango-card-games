import { deleteRoom, getAllRooms } from "../state/roomManager.ts";


export function handleDisconnect(socket: any, io: any) {
  socket.on("disconnect", () => {
    try {
      const rooms = getAllRooms();

      for (const roomId in rooms) {
        const room = rooms[roomId];
        const player = room.players.find((p) => p.socketId === socket.id);
        const playerIndex = room.players.findIndex((p) => p.socketId === socket.id);

        if (player && playerIndex !== -1) {

          room.players.splice(playerIndex, 1);


          io.to(roomId).emit("player_left", {
            roomId,
            playerName: player.name,
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
