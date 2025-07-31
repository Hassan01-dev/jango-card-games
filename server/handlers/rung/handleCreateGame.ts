import { createRungRoom } from "../../state/rungRoomManager.ts";
import { RungCreateRoomEventData } from "../../types/rung.ts";
import { generatRoomId } from "../../utils/helper.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleCreateRoomEvent(
  socket: any,
  io: any,
  data: RungCreateRoomEventData
) {
  try {
    const { playerId, playerName } = data;
    const roomId = generatRoomId();

    createRungRoom(roomId, playerId, playerName);

    await sendEncryptedEvent("rung", "game_created", { roomId }, socket.id, io);
  } catch (error: any) {
    console.error("Error in createRoom handler:", error.message);
    await sendEncryptedEvent(
      "rung",
      "error",
      { message: error.message },
      socket.id,
      io
    );
  }
}
