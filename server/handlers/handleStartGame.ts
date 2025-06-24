import { getRoom } from "../state/roomManager.ts";

export function handleStartGame(socket: any, io: any) {
  socket.on("start_game", (roomId: string) => {
    try {
      if (!roomId) throw new Error("Invalid play");

      const room = getRoom(roomId);
      if (!room) throw new Error("Room not found");

      io.to(roomId).emit("game_started", { roomId });

    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in play_card:", error);
      }
    }
  });
}
