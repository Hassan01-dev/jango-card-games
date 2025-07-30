import { getGulamChorRoom } from "../../state/gulamChorRoomManager.ts";
import { GulamChorRemovePairsEventData } from "../../types/gulamChor.ts";
import { CardDeck } from "../../utils/cardDeck.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleRemovePairs(
  socket: any,
  io: any,
  data: GulamChorRemovePairsEventData
) {
  const { roomId, playerId, removedCards } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getGulamChorRoom(roomId);
    if (!room) throw new Error("Room not found");

    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Player not found");

    player.cards = player.cards.filter((card) => !removedCards.includes(card));

    await sendEncryptedEvent("gulam_chor", "pair_removed", {noOfPairsRemoved: (removedCards.length / 2), playerName: player.name}, roomId, io);

    if(player.cards.length === 0) {
      player.isWon = true;
      await sendEncryptedEvent("gulam_chor", "player_won", {winnerId: playerId, playerName: player.name}, roomId, io);
      await sendEncryptedEvent("gulam_chor", "game_won", {}, player.socketId, io);
    }

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
