import { getRoom } from "../state/roomManager.ts";
import { AudioMessageType } from "../types/main.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";

export async function handleAudioMessage(
  socket: any,
  io: any,
  game: string,
  data: AudioMessageType
) {
  const { roomId, audioKey } = data;
  try {
    
    const targetRoom = getRoom(roomId);
    if (!targetRoom) throw new Error("Room not found");

    await sendEncryptedEvent(
      game,
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
        game,
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in sending audio message:", error);
    }
  }
}
