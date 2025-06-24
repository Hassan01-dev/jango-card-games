import { getRoom } from "../state/roomManager.ts";

export function handleGameChat(socket: any, io: any) {
  socket.on("game_chat", (data: {
    roomId: string;
    message: string;
  }) => {
    try {
      if (!data || !data.roomId) throw new Error("Invalid chat data");

      const room = getRoom(data.roomId);
      if (!room) throw new Error("Room not found");

      io.to(data.roomId).emit("chat_message", data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in game_chat:", error);
      }
    }
  });
}
