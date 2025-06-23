const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const handleJoinRoom = require("./handlers/joinRoom");
const handleGameChat = require("./handlers/gameChat");
const handlePlayCard = require("./handlers/playCard");
const handleDisconnect = require("./handlers/disconnect");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  handleJoinRoom(socket, io);
  handleGameChat(socket, io);
  handlePlayCard(socket, io);
  handleDisconnect(socket, io);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
