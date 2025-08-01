import { getRungRoom } from "../../state/rungRoomManager.ts";
import { RungPlayer, RungStartGameEventData } from "../../types/rung.ts";
import { CardDeck } from "../../utils/cardDeck.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleStartGame(
  socket: any,
  io: any,
  data: RungStartGameEventData
) {
  const { roomId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getRungRoom(roomId);
    if (!room) throw new Error("Room not found");
    if (room.players.length !== 4) throw new Error("Room must have 4 players");

    const currentDeck = new CardDeck();
    currentDeck.shuffleDeck();
    currentDeck.distributeCardsEvenly(room.players);
    room.isStarted = true;

    await sendEncryptedEvent("rung", "game_started", {isHiddenCard: false}, roomId, io);

    setTimeout(async () => {
      room.players.forEach(async (player) => {
        await sendEncryptedEvent(
          "rung",
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
        "rung",
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in play_card:", error);
    }
  }
}
