const { getRoom } = require("../state/roomManager");
const parseCard = require("../utils/parseCard");

function handlePlayCard(socket, io) {
  socket.on("play_card", ({ roomId, card, playerName }) => {
    try {
      if (!roomId || !card || !playerName) throw new Error("Invalid play");

      const room = getRoom(roomId);
      if (!room) throw new Error("Room not found");

      room.playedCards = room.playedCards || [];
      const parsed = parseCard(card); // { rank, suit, value }
      
      const playedCard = { playerName, card, suit: parsed.suit, value: parsed.value, socketId: socket.id };
      room.playedCards.push(playedCard);

      io.to(roomId).emit("card_played", { playerName, card });

      const leadSuit = room.playedCards[0].suit;
      const highest = room.playedCards.reduce((max, curr) => (curr.suit === leadSuit && curr.value > max.value ? curr : max));

    // 🔥 Detect Thulla: card does not match lead suit
      if (parsed.suit !== leadSuit) {

        io.to(roomId).emit("thulla", {
          triggeredBy: playerName,
          looser: highest.playerName,
          cardsTaken: room.playedCards.count,
        });

        // TODO: Add cards to looser's hand if you're tracking hands on server
        io.to(highest.socketId).emit("cards_taken", {
          cards: room.playedCards.map(c => c.card),
        });
        // TODO: Optionally broadcast updated hand count

        // Reset for next round
        room.playedCards = [];
        room.noOfTurns = 0;

        io.to(roomId).emit("update_turn", {
          currentTurn: highest.playerName,
        })
        return;
      }

      room.noOfTurns += 1;
      if (room.noOfTurns === room.players.length) {

        // Reset for next round
        room.playedCards = [];
        room.noOfTurns = 0;

        io.to(roomId).emit("empty_table");
        io.to(roomId).emit("update_turn", {
            currentTurn: highest.playerName,
        })
        return;
      }

      // No thulla yet → pass to next player
      const currentIndex = room.players.findIndex(p => p.id === socket.id);
      const nextIndex = (currentIndex + 1) % room.players.length;
      room.currentTurn = room.players[nextIndex].id;

      io.to(roomId).emit("update_turn", {
        currentTurn: room.players[nextIndex].name,
      });

    } catch (error) {
      socket.emit("error", { message: error.message });
      console.error("Error in play_card:", error);
    }
  });
}

module.exports = handlePlayCard;
