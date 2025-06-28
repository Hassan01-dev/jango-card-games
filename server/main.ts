import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import "jsr:@std/dotenv/load";

import { handleGameChat } from "./handlers/gameChat.ts";
import { handlePlayCard } from "./handlers/playCard.ts";
import { handleDisconnect } from "./handlers/disconnect.ts";
import { handleWon } from "./handlers/won.ts";
import { handleStartGame } from "./handlers/handleStartGame.ts";
import { handleJoinGame } from "./handlers/handleJoinGame.ts";
import { handleSecureEvent } from "./handlers/secureEventHandler.ts";
import { handleRequestCard, handleApproveRequestCard } from "./handlers/handleRequestCard.ts";

const io = new Server({
  cors: {
    origin: [
      "https://jango-card-games.vercel.app",
      "http://localhost:3000",
    ],
  },
});

io.on("connection", (socket: any) => {
  console.log(`socket ${socket.id} connected`);

  handleSecureEvent(socket, io);
  handleJoinGame(socket, io);
  handleGameChat(socket, io);
  handlePlayCard(socket, io);
  handleDisconnect(socket, io);
  handleStartGame(socket, io);
  handleWon(socket, io);
  handleRequestCard(socket, io);
  handleApproveRequestCard(socket, io);
});

await serve(io.handler(), {
  port: 3001,
});
