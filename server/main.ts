import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import { handleGameChat } from "./handlers/gameChat.ts";
import { handlePlayCard } from "./handlers/playCard.ts";
import { handleDisconnect } from "./handlers/disconnect.ts";
import { handleWon } from "./handlers/won.ts";
import { handleStartGame } from "./handlers/handleStartGame.ts";
import { handleCreateRoom } from "./handlers/createRoom.ts";
import { handleJoinGame } from "./handlers/handleJoinGame.ts";
import { handleRequestCard, handleApproveRequestCard } from "./handlers/handleRequestCard.ts";

const io = new Server({
  cors: {
    origin: ["https://jango-card-games.vercel.app", "http://localhost:3000"],
  },
});

io.on("connection", (socket: any) => {
  console.log(`socket ${socket.id} connected`);

  handleCreateRoom(socket, io);
  handleJoinGame(socket, io);
  handleGameChat(socket, io);
  handlePlayCard(socket, io);
  handleDisconnect(socket, io);
  handleStartGame(socket, io);
  handleWon(socket, io);
  handleRequestCard(socket, io);
  handleApproveRequestCard(socket, io);

  socket.on("secret_event", (roomId: string) => {
    io.to(roomId).emit("play_audio");
  });
});

await serve(io.handler(), {
  port: 3001,
});