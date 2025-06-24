// import { serve } from "https://deno.land/std/http/server.ts";


// const io = new Server({
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   handleJoinRoom(socket, io);
//   handleGameChat(socket, io);
//   handlePlayCard(socket, io);
//   handleDisconnect(socket, io);
// });

// const PORT = Deno.env.get("PORT") || "3001";
// const handler = io.handler();

// console.log(`Socket.io server running on port ${PORT}`);
// await serve(handler, { port: Number(PORT) });

import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import { handleJoinRoom } from "./handlers/joinRoom.ts";
import { handleGameChat } from "./handlers/gameChat.ts";
import { handlePlayCard } from "./handlers/playCard.ts";
import { handleDisconnect } from "./handlers/disconnect.ts";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket: any) => {
  console.log(`socket ${socket.id} connected`);

  handleJoinRoom(socket, io);
  handleGameChat(socket, io);
  handlePlayCard(socket, io);
  handleDisconnect(socket, io);
});

await serve(io.handler(), {
  port: 3001,
});