import { SecureEventPayload } from "../types/main.ts";
import { decryptPayload } from "../utils/crypto.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";

import handleThullaGameEvents from "./handleThullaGameEvents.ts";

export function handleSecureEvent(socket: any, io: any) {
  socket.on("secure_event", async (encryptedPayload: string) => {
    try {
      const { game, event_type, data } = (await decryptPayload(
        encryptedPayload
      )) as SecureEventPayload;

      switch (game) {
        case "thulla":
          handleThullaGameEvents(socket, io, event_type, data);
          break;
        default:
          console.warn("Unknown game:", game);
          await sendEncryptedEvent(
            "thulla",
            "error",
            {
              message: `Unknown game: ${game}`,
            },
            socket.id,
            io
          );
          return;
      }
    } catch (error: any) {
      console.error("Failed to process secure_event:", error.message);
      await sendEncryptedEvent(
        "thulla",
        "error",
        {
          message: "Invalid or corrupted payload",
        },
        socket.id,
        io
      );
    }
  });
}
