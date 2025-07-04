import { getRoom } from "../state/roomManager.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { AudioMessageType } from "../utils/types.ts";

export async function handleAudioMessage(
  socket: any,
  io: any,
  data: AudioMessageType
) {
  const { roomId, audioKey } = data;
  try {
    
    const targetRoom = getRoom(roomId);
    if (!targetRoom) throw new Error("Room not found");

    await sendEncryptedEvent(
      "audio_message",
      {
        audioKey
      },
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
      console.error("Error in sending audio message:", error);
    }
  }
}
