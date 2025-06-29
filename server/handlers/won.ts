import { getRoom } from "../state/roomManager.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { WonEventData } from "../utils/types.ts";

export async function handleWon(socket: any, io: any, data: WonEventData) {
  const { roomId, playerName } = data;
  try {
    if (!roomId || !playerName) throw new Error("Invalid play");

    const room = getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const player = room.players.find((player) => player.socketId === socket.id);
    if (!player) throw new Error("Player not found");

    player.isWon = true;

    const remainingPlayerCount = room.players.filter((player) => !player.isWon);

    if (remainingPlayerCount.length === 1) {
      await sendEncryptedEvent(
        "game_over",
        { looser: remainingPlayerCount[0].name },
        roomId,
        io
      );

      return;
    }

    await sendEncryptedEvent(
      "player_won",
      { playerName: player.name, playerId: player.id },
      roomId,
      io
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        "error",
        { message: error.message },
        socket.id,
        io
      );

      console.error("Error in play_card:", error);
    }
  }
}
