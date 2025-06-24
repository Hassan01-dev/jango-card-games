import { createRoom, getRoom } from "../state/roomManager.ts";

export function handleJoinRoom(socket: any, io: any) {
  socket.on("join_room", ({ roomId, playerName }: {
    roomId: string;
    playerName: string;
  }) => {
    try {
      if (!roomId || !playerName) throw new Error("Room ID and player name required");

      socket.join(roomId);

      const room = getRoom(roomId) || createRoom(roomId);
      const targetRoom = getRoom(roomId);

      targetRoom?.players.push({ id: socket.id, name: playerName });

      if (!targetRoom?.currentTurn && targetRoom?.players.length === 1) {
        targetRoom.currentTurn = socket.id;
      }

      io.to(roomId).emit("room_joined", {
        roomId,
        playerName,
        players: targetRoom?.players,
        currentTurn: targetRoom?.currentTurn,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in join_room:", error);
      }
    }
  });
}
