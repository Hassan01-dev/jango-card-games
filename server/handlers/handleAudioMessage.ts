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
