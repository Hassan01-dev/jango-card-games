import { getGulamChorRoom } from "../../state/gulamChorRoomManager.ts";
import { GulamChorPlayer, GulamChorStartGameEventData } from "../../types/gulamChor.ts";
import { CardDeck } from "../../utils/cardDeck.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleStartGame(
  socket: any,
  io: any,
  data: GulamChorStartGameEventData
) {
  const { roomId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getGulamChorRoom(roomId);
    if (!room) throw new Error("Room not found");

    const currentDeck = new CardDeck();
    currentDeck.shuffleDeck();
    room.removedCard = currentDeck.distributeCardsForGulamChor(room.players, "jack_of_spades");
    room.isStarted = true;

    await sendEncryptedEvent("gulam_chor", "game_started", {isHiddenCard: false}, roomId, io);

    setTimeout(async () => {
      room.players.forEach(async (player) => {
        await sendEncryptedEvent(
          "gulam_chor",
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
        "gulamChor",
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in play_card:", error);
    }
  }
}

export async function handleStartGameWithHiddenCard(
  socket: any,
  io: any,
  data: GulamChorStartGameEventData
) {
  const { roomId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getGulamChorRoom(roomId);
    if (!room) throw new Error("Room not found");

    const currentDeck = new CardDeck();
    currentDeck.shuffleDeck();
    room.removedCard = currentDeck.distributeCardsForGulamChor(room.players);
    room.isStarted = true;

    await sendEncryptedEvent("gulam_chor", "game_started", {isHiddenCard: true}, roomId, io);

    setTimeout(async () => {
      room.players.forEach(async (player) => {
        await sendEncryptedEvent(
          "gulam_chor",
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
        "gulamChor",
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in play_card:", error);
    }
  }
}
