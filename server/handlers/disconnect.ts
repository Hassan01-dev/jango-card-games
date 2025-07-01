import { getAllRooms } from "../state/roomManager.ts";
import { getNextEligiblePlayer } from "../utils/helper.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";

export function handleDisconnect(socket: any, io: any) {
  socket.on("disconnect", async () => {
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

          if (room.currentTurn?.id === player.id) {
            const nextPlayer = getNextEligiblePlayer(room, playerIndex);
            const nextNextPlayer = getNextEligiblePlayer(room, playerIndex + 1);
            room.currentTurn = nextPlayer;
            await sendEncryptedEvent(
              "update_turn",
              {
                currentTurn: room.currentTurn,
                nextTurn: { id: nextNextPlayer?.id, name: nextNextPlayer?.name },
                playersDetail: room.players.map((p) => ({
                  id: p.id,
                  name: p.name,
                  cardsCount: p.cards.length,
                })),
              },
              roomId,
              io
            );
          }

          if (room.players.length === 0) {
            delete rooms[roomId];
          } else {
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
