import { getAllRooms } from "../state/roomManager.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";

export function handleDisconnect(socket: any, io: any) {
  socket.on("disconnect", async() => {
    try {
      const rooms = getAllRooms();

      for (const roomId in rooms) {
        const room = rooms[roomId];
        const player = room.players.find((p) => p.socketId === socket.id);
        const playerIndex = room.players.findIndex(
          (p) => p.socketId === socket.id
        );

        if (player && playerIndex !== -1) {
          room.players.splice(playerIndex, 1);

          await sendEncryptedEvent(
            "player_left",
            {
              roomId,
              playerName: player.name,
              players: room.players,
              currentTurn: room.currentTurn,
            },
            roomId,
            io
          );
        }
      }
    } catch (error) {
      await sendEncryptedEvent(
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in disconnect handler:", error);
    }
  });
}
