import { getRoom } from "../state/roomManager.ts";

export function handleWon(socket: any, io: any) {
  socket.on("won", ({ roomId, playerName }: {
    roomId: string;
    playerName: string;
  }) => {
    try {
      if (!roomId || !playerName) throw new Error("Invalid play");

      const room = getRoom(roomId);
      if (!room) throw new Error("Room not found");

      const player = room.players.find((player) => player.socketId === socket.id);
      if (!player) throw new Error("Player not found");

      player.isWon = true

      const remainingPlayerCount = room.players.filter((player) => !player.isWon);
      
      if (remainingPlayerCount.length === 1) {
        io.to(roomId).emit("game_over", { looser: remainingPlayerCount[0].name });
        return;
      }

      io.to(roomId).emit("player_won", { playerName: player.name, playerId: player.id });

    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in play_card:", error);
      }
    }
  });
}
