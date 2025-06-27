import { getRoom } from "../state/roomManager.ts";
import { CardDeck } from "../utils/cardDeck.ts";
import { Player } from "../utils/types.ts";

export function handleStartGame(socket: any, io: any) {
  socket.on("start_game", (roomId: string) => {
    try {
      console.log("I am here")
      if (!roomId) throw new Error("Invalid play");

      const room = getRoom(roomId);
      if (!room) throw new Error("Room not found");

      const currentDeck = new CardDeck();
      currentDeck.shuffleDeck();
      const firstPlayer = currentDeck.distributeCards(room.players) as Player;
      room.currentTurn = { id: firstPlayer.id, name: firstPlayer.name };
      room.isStarted = true

      io.to(roomId).emit("game_started");

      setTimeout(() => {
        room.players.forEach((player) => {
          io.to(player.socketId).emit("hand_received", {
            currentTurn: room.currentTurn,
            hand: player.cards,
            opponents: room.players
              .filter((p) => p.id !== player.id)
              .map((opponent) => ({
                name: opponent.name,
                cardsCount: opponent.cards.length,
              })),
          });
        });
      }, 4000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        socket.emit("error", { message: error.message });
        console.error("Error in play_card:", error);
      }
    }
  });
}
