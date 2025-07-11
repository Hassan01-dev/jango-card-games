import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import "jsr:@std/dotenv/load";

import { handleSecureEvent } from "./handlers/secureEventHandler.ts";
import { handleDisconnect } from "./handlers/disconnect.ts";

export const connections = {} as { [key: string]: any };

const io = new Server({
  cors: {
    origin: ["http://localhost:3000", "https://cards.playlab.live"],
  },
});

io.on("connection", (socket: any) => {
  console.log(`socket ${socket.id} connected`);
  handleDisconnect(socket, io, connections);
  handleSecureEvent(socket, io, connections);
});

await serve(io.handler(), {
  port: 3001,
});
