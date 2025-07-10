import { getRoom } from "../../state/roomManager.ts";
import { CardDeck } from "../../utils/cardDeck.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";
import { PlayCardEventData, Player, StartGameEventData } from "../../utils/types.ts";
import { handlePlayCard } from "./playCard.ts";

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

    await sendEncryptedEvent("thulla", "game_started", {}, roomId, io);

    setTimeout(async () => {
      room.players.forEach(async (player) => {
        await sendEncryptedEvent(
          "thulla",
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

      const data = {roomId, card: "ace_of_spades", playerName: firstPlayer.name, playerId: firstPlayer.id}
      await handlePlayCard(socket, io, data as PlayCardEventData);
    }, 4000);
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        "thulla",
        "error",
        { message: error.message },
        socket.id,
        io
      );
      console.error("Error in play_card:", error);
    }
  }
}
