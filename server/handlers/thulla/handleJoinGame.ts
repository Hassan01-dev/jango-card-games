import { connections } from "../../main.ts";
import { getRoom } from "../../state/roomManager.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";
import { JoinGameEventData } from "../../utils/types.ts";

export async function handleJoinGame(
  socket: any,
  io: any,
  data: JoinGameEventData
) {
  const { roomId, playerName, playerId } = data;
  try {
    connections[socket.id] = {
      gameType: "thulla",
    };

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
      cards: [],
    });

    if (!targetRoom?.currentTurn && targetRoom?.players.length === 1) {
      targetRoom.currentTurn = { id: playerId, name: playerName };
    }

    await sendEncryptedEvent(
      "thulla",
      "non_started_room_joined",
      {
        players: targetRoom?.players,
        ownerId: targetRoom.ownerId,
        ownerName: targetRoom.ownerName,
      },
      roomId,
      io
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        "thulla",
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in join_room:", error);
    }
  }
}
