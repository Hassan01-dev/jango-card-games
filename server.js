const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

// Object to store room information
const rooms = {};

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("join_game", (gameId) => {
    socket.join(gameId);
    if (!rooms[gameId]) {
      rooms[gameId] = {
        players: [],
        currentTurn: null
      };
    }

    io.to(gameId).emit("room_joined", { 
      roomId: gameId, 
      players: rooms[gameId].players,
      currentTurn: rooms[gameId].currentTurn 
    });
    console.log(`user with id-${socket.id} joined room - ${gameId}`);
  });

  socket.on("join_room", ({ roomId, playerName }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        currentTurn: null
      };
    }
    
    // Add player to room
    rooms[roomId].players.push({
      id: socket.id,
      name: playerName
    });
    
    // Set current turn to first player if not set
    if (!rooms[roomId].currentTurn && rooms[roomId].players.length === 1) {
      rooms[roomId].currentTurn = socket.id;
    }
    
    console.log(`user with id-${socket.id} joined room - ${roomId} - ${playerName}`);
    io.to(roomId).emit("room_joined", { 
      roomId, 
      playerName,
      players: rooms[roomId].players,
      currentTurn: rooms[roomId].currentTurn 
    });
  });

  socket.on("game_chat", (data) => {
    console.log(data, "DATA");
    io.to(data.gameId).emit("chat_message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    
    // Find and remove player from their room
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);
        
        // Update current turn if necessary
        if (room.currentTurn === socket.id) {
          room.currentTurn = room.players.length > 0 ? room.players[0].id : null;
        }
        
        io.to(roomId).emit("player_left", { 
          roomId, 
          playerName,
          players: room.players,
          currentTurn: room.currentTurn
        });
        
        // Clean up empty rooms
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
