import { createRoom } from "../state/roomManager.ts";
import { generatRoomId } from "../utils/helper.ts";

export function handleCreateRoom(socket: any, io: any) {
  socket.on("create_room", ({ playerId, playerName }: { playerId: string, playerName: string }) => {
    try {
      const roomId = generatRoomId()
      createRoom(roomId, playerId, playerName);

      io.emit("room_created", {
        roomId,
      });
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in join_room:", error);
      }
    }
  });
}
