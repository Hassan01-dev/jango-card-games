import { decryptPayload } from "../utils/crypto.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { handleCreateRoomEvent } from "./handleCreateGame.ts";
import { SecureEventPayload } from "../utils/types.ts";

export function handleSecureEvent(socket: any, io: any) {
  socket.on("secure_event", async (encryptedPayload: string) => {
    try {
      const { event_type, data } = await decryptPayload(encryptedPayload) as SecureEventPayload;

      switch (event_type) {
        case "create_room":
          await handleCreateRoomEvent(socket, io, data);
          break;

        default:
          console.warn("Unknown event_type:", event_type);
          await sendEncryptedEvent("error", {
            message: `Unknown event_type: ${event_type}`,
          }, socket.id, io);
      }
    } catch (error: any) {
      console.error("Failed to process secure_event:", error.message);
      await sendEncryptedEvent("error", {
        message: "Invalid or corrupted payload",
      }, socket.id, io);
    }
  });
}
