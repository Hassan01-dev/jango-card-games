const { getRoom } = require("../state/roomManager");

function handleGameChat(socket, io) {
  socket.on("game_chat", (data) => {
    try {
      if (!data || !data.roomId) throw new Error("Invalid chat data");

      const room = getRoom(data.roomId);
      if (!room) throw new Error("Room not found");

      io.to(data.roomId).emit("chat_message", data);
    } catch (error) {
      socket.emit("error", { message: error.message });
      console.error("Error in game_chat:", error);
    }
  });
}

module.exports = handleGameChat;
