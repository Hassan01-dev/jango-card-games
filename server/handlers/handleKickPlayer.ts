import { KickPlayerEventData } from "../types/main.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";

export async function handleKickPlayer(
  socket: any,
  io: any,
  data: KickPlayerEventData
) {
  const { targetRoom, roomId, playerId, ownerId, game } = data;
  try {
    if (!playerId || !ownerId) throw new Error("player ID and owner ID are required");
    if (!targetRoom) throw new Error("Room not found");
    if (targetRoom.ownerId !== ownerId) throw new Error("Only the owner can kick players");
  
    const playerToKick = targetRoom.players.find((p) => p.id === playerId);
    if (!playerToKick) throw new Error("Player not found");

    targetRoom.players = targetRoom.players.filter((p) => p.id !== playerId);

    await sendEncryptedEvent(
      game,
      "player_kicked",
      {
        players: targetRoom.players,
        kickedPlayerId: playerId,
      },
      roomId,
      io
    );

    await sendEncryptedEvent(
      game,
      "kicked",
      { message: "You have been kicked from the room" },
      playerToKick.socketId,
      io
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        game,
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in kick_player:", error);
    }
  }
}
