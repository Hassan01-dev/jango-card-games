import { createGulamChorRoom } from "../../state/gulamChorRoomManager.ts";
import { GulamChorCreateRoomEventData } from "../../types/gulamChor.ts";
import { generatRoomId } from "../../utils/helper.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleCreateRoomEvent(
  socket: any,
  io: any,
  data: GulamChorCreateRoomEventData
) {
  try {
    const { playerId, playerName } = data;
    const roomId = generatRoomId();

    createGulamChorRoom(roomId, playerId, playerName);

    await sendEncryptedEvent("gulam_chor", "game_created", { roomId }, socket.id, io);
  } catch (error: any) {
    console.error("Error in createRoom handler:", error.message);
    await sendEncryptedEvent(
      "gulam_chor",
      "error",
      { message: error.message },
      socket.id,
      io
    );
  }
}
