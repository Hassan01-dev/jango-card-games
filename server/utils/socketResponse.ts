import { encryptPayload } from "./crypto.ts";

export async function sendEncryptedEvent(
  event_type: string,
  data: unknown,
  socketId: string,
  io: any,
): Promise<void> {
  const payload = await encryptPayload({ event_type, data });
  io.to(socketId).emit("secure_event", payload);
}
