import { parseCard } from "../utils/parseCard.ts";
import { getRoom } from "../state/roomManager.ts";
import { Room } from "../utils/types.ts";

function getNextEligiblePlayer(room: Room, startIndex: number) {
  const players = room.players;
  let index = startIndex;
  let attempts = 0;

  while (attempts < players.length) {
    index = (index + 1) % players.length;
    const player = players[index];
    if (!player.isWon) return player;
    attempts++;
  }
}

export function handlePlayCard(socket: any, io: any) {
  socket.on("play_card", ({ roomId, card, playerName }: {
    roomId: string;
    card: string;
    playerName: string;
  }) => {
    try {
      if (!roomId || !card || !playerName) throw new Error("Invalid play");

      const room = getRoom(roomId);
      if (!room) throw new Error("Room not found");

      room.playedCards = room.playedCards || [];
      const parsed = parseCard(card);

      const playedCard = {
        playerName,
        card,
        suit: parsed.suit,
        value: parsed.value,
        socketId: socket.id
      };
      room.playedCards.push(playedCard);

      io.to(roomId).emit("card_played", { playerName, card });

      const leadSuit = room.playedCards[0].suit;
      const highest = room.playedCards.reduce((max, curr) =>
        curr.suit === leadSuit && curr.value > max.value ? curr : max
      );

      // 🔥 Thulla detection
      if (parsed.suit !== leadSuit) {
        io.to(roomId).emit("thulla", {
          triggeredBy: playerName,
          looser: highest.playerName,
          cardsTaken: room.playedCards.length,
        });

        io.to(highest.socketId).emit("cards_taken", {
          cards: room.playedCards.map(c => c.card),
        });

        room.playedCards = [];
        room.noOfTurns = 0;

        let nextTurnPlayer = room.players.find(p => p.name === highest.playerName);
        if (!nextTurnPlayer || nextTurnPlayer.isWon) {
          const startIndex = room.players.findIndex(p => p.id === socket.id);
          nextTurnPlayer = getNextEligiblePlayer(room, startIndex);
        }

        if (!nextTurnPlayer) {
          throw new Error("No next turn player found");
        }

        room.currentTurn = nextTurnPlayer.id;
        io.to(roomId).emit("update_turn", {
          currentTurn: nextTurnPlayer.name,
        });
        return;
      }

      room.noOfTurns += 1;

      const activePlayers = room.players.filter(p => !p.isWon);

      if (room.noOfTurns === activePlayers.length) {
        room.playedCards = [];
        room.noOfTurns = 0;

        io.to(roomId).emit("empty_table");

        let nextTurnPlayer = room.players.find(p => p.name === highest.playerName);
        if (!nextTurnPlayer || nextTurnPlayer.isWon) {
          const startIndex = room.players.findIndex(p => p.id === socket.id);
          nextTurnPlayer = getNextEligiblePlayer(room, startIndex);
        }

        if (!nextTurnPlayer) {
          throw new Error("No next turn player found");
        }

        room.currentTurn = nextTurnPlayer.id;
        io.to(roomId).emit("update_turn", {
          currentTurn: nextTurnPlayer.name,
        });
        return;
      }

      // Pass to next eligible player
      const currentIndex = room.players.findIndex(p => p.id === socket.id);
      const nextPlayer = getNextEligiblePlayer(room, currentIndex);

      if (!nextPlayer) {
        throw new Error("No next player found");
      }

      room.currentTurn = nextPlayer.id;
      io.to(roomId).emit("update_turn", {
        currentTurn: nextPlayer.name,
      });

    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in play_card:", error);
      }
    }
  });
}
