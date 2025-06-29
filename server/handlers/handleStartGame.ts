import { getRoom } from "../state/roomManager.ts";
import { CardDeck } from "../utils/cardDeck.ts";
import { sendEncryptedEvent } from "../utils/socketResponse.ts";
import { Player, StartGameEventData } from "../utils/types.ts";

export async function handleStartGame(
  socket: any,
  io: any,
  data: StartGameEventData
) {
  const { roomId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const currentDeck = new CardDeck();
    currentDeck.shuffleDeck();
    const firstPlayer = currentDeck.distributeCards(room.players) as Player;
    room.currentTurn = { id: firstPlayer.id, name: firstPlayer.name };
    room.isStarted = true;

    await sendEncryptedEvent("game_started", {}, roomId, io);

    setTimeout(() => {
      room.players.forEach(async (player) => {
        await sendEncryptedEvent(
          "hand_received",
          {
            currentTurn: room.currentTurn,
            hand: player.cards,
            opponents: room.players
              .filter((p) => p.id !== player.id)
              .map((opponent) => ({
                id: opponent.id,
                name: opponent.name,
                cardsCount: opponent.cards.length,
              })),
          },
          player.socketId,
          io
        );
      });
    }, 4000);
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in play_card:", error);
    }
  }
}
