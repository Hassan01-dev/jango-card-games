import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import { handleJoinRoom } from "./handlers/joinRoom.ts";
import { handleGameChat } from "./handlers/gameChat.ts";
import { handlePlayCard } from "./handlers/playCard.ts";
import { handleDisconnect } from "./handlers/disconnect.ts";
import { handleWon } from "./handlers/won.ts";
import { handleStartGame } from "./handlers/handleStartGame.ts";

const io = new Server({
  cors: {
    origin: "https://jango-card-games.vercel.app",
  },
});

io.on("connection", (socket: any) => {
  console.log(`socket ${socket.id} connected`);

  handleJoinRoom(socket, io);
  handleGameChat(socket, io);
  handlePlayCard(socket, io);
  handleDisconnect(socket, io);
  handleStartGame(socket, io);
  handleWon(socket, io);
});

await serve(io.handler(), {
  port: 3001,
});