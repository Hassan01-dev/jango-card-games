import { getRoom } from "../state/roomManager.ts";

export function handleJoinGame(socket: any, io: any) {
  socket.on(
    "join_game",
    ({
      roomId,
      playerName,
      playerId,
    }: {
      roomId: string;
      playerName: string;
      playerId: string;
    }) => {
      try {
        if (!roomId || !playerName || !playerId) {
          throw new Error("Room ID, player name and player ID required");
        }

        const targetRoom = getRoom(roomId);
        if (!targetRoom) throw new Error("Room not found");

        if (targetRoom.isStarted) {
          throw new Error("Cannot join started room as a new player");
        }
        if (targetRoom?.players.length === 8) throw new Error("Room is full");

        socket.join(roomId);

        targetRoom?.players.push({
          id: playerId,
          name: playerName,
          socketId: socket.id,
          isWon: false,
          cards: []
        });

        if (!targetRoom?.currentTurn && targetRoom?.players.length === 1) {
          targetRoom.currentTurn = { id: playerId, name: playerName };
        }

        io.to(roomId).emit("non_started_room_joined", {
          players: targetRoom?.players,
          ownerId: targetRoom.ownerId,
          ownerName: targetRoom.ownerName,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit("error", { message: error.message });
          console.error("Error in join_room:", error);
        }
      }
    }
  );
}
