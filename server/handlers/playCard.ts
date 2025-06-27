import { parseCard } from "../utils/parseCard.ts";
import { getRoom } from "../state/roomManager.ts";
import { getNextEligiblePlayer } from "../utils/helper.ts";

async function waitFor() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

export function handlePlayCard(socket: any, io: any) {
  socket.on(
    "play_card",
    async ({
      roomId,
      card,
      playerName,
      playerId,
    }: {
      roomId: string;
      card: string;
      playerName: string;
      playerId: string;
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
          playerId,
          socketId: socket.id,
        };
        room.playedCards.push(playedCard);

        io.to(roomId).emit("card_played", { playerName, card });
        const currentPlayer = room.players.find((p) => p.id === playerId);
        if (currentPlayer) {
          currentPlayer.cards = currentPlayer.cards.filter((c) => c !== card);
        }

        const leadSuit = room.playedCards[0].suit;
        const highest = room.playedCards.reduce((max, curr) =>
          curr.suit === leadSuit && curr.value > max.value ? curr : max
        );

        // 🔥 Thulla detection
        if (parsed.suit !== leadSuit) {
          await waitFor();
          io.to(roomId).emit("thulla", {
            triggeredBy: playerName,
            looser: highest.playerName,
            cardsTaken: room.playedCards.length,
          });

          io.to(highest.socketId).emit("cards_taken", {
            cards: room.playedCards.map((c) => c.card),
          });

          const highestPlayer = room.players.find(
            (p) => p.id === highest.playerId
          );
          if (highestPlayer) {
            highestPlayer.cards = [
              ...highestPlayer.cards,
              ...room.playedCards.map((c) => c.card),
            ];
          }

          room.playedCards = [];
          room.noOfTurns = 0;

          room.currentTurn = { id: highest.playerId, name: highest.playerName };
          io.to(roomId).emit("update_turn", {
            currentTurn: room.currentTurn,
            playersDetail: room.players.map((p) => ({
              id: p.id,
              name: p.name,
              cardsCount: p.cards.length,
            })),
          });
          return;
        }

        room.noOfTurns += 1;

        const activePlayers = room.players.filter((p) => !p.isWon);

        if (room.noOfTurns === activePlayers.length) {
          room.playedCards = [];
          room.noOfTurns = 0;
          await waitFor();
          io.to(roomId).emit("empty_table");

          let nextTurnPlayer = room.players.find(
            (p) => p.id === highest.playerId
          );
          if (!nextTurnPlayer || nextTurnPlayer.isWon) {
            const startIndex = room.players.findIndex((p) => p.id === playerId);
            nextTurnPlayer = getNextEligiblePlayer(room, startIndex);
          }

          if (!nextTurnPlayer) {
            throw new Error("No next turn player found");
          }
          room.currentTurn = {
            id: nextTurnPlayer.id,
            name: nextTurnPlayer.name,
          };
          io.to(roomId).emit("update_turn", {
            currentTurn: room.currentTurn,
            playersDetail: room.players.map((p) => ({
              id: p.id,
              name: p.name,
              cardsCount: p.cards.length,
            })),
          });
          return;
        }

        // Pass to next eligible player
        const currentIndex = room.players.findIndex((p) => p.id === playerId);
        const nextPlayer = getNextEligiblePlayer(room, currentIndex);
        if (!nextPlayer) {
          throw new Error("No next player found");
        }

        room.currentTurn = { id: nextPlayer.id, name: nextPlayer.name };
        io.to(roomId).emit("update_turn", {
          currentTurn: room.currentTurn,
          playersDetail: room.players.map((p) => ({
            id: p.id,
            name: p.name,
            cardsCount: p.cards.length,
          })),
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit("error", { message: error.message });
          console.error("Error in play_card:", error);
        }
      }
    }
  );
}
