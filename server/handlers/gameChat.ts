import { getRoom } from "../state/roomManager.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { GameChatEventData } from "../utils/types.ts";

export async function handleGameChat(
  socket: any,
  io: any,
  data: GameChatEventData
) {
  const { roomId, message, user, time } = data;
  try {
    if (!roomId || !message) throw new Error("Invalid chat data");

    const room = getRoom(roomId);
    if (!room) throw new Error("Room not found");

    await sendEncryptedEvent("chat_message", { roomId, message, user, time }, roomId, io);
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in game_chat:", error);
    }
  }
}
