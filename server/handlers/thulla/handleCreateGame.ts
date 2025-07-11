import { createThullaRoom } from "../../state/roomManager.ts";
import { ThullaCreateRoomEventData } from "../../types/thulla.ts";
import { generatRoomId } from "../../utils/helper.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleCreateRoomEvent(
  socket: any,
  io: any,
  data: ThullaCreateRoomEventData
) {
  try {
    const { playerId, playerName } = data;
    const roomId = generatRoomId();

    createThullaRoom(roomId, playerId, playerName);

    await sendEncryptedEvent("thulla", "game_created", { roomId }, socket.id, io);
  } catch (error: any) {
    console.error("Error in createRoom handler:", error.message);
    await sendEncryptedEvent(
      "thulla",
      "error",
      { message: error.message },
      socket.id,
      io
    );
  }
}
