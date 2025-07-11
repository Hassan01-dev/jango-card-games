import { getThullaRoom } from "../../state/roomManager.ts";
import { PlayCardEventData } from "../../types/main.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";
import { handlePlayCard } from "./handlePlayCard.ts";

export async function handeleAutoPlayCard(
  socket: any,
  io: any,
  data: { roomId: string }
) {
  const { roomId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getThullaRoom(roomId);
    if (!room) throw new Error("Room not found");
    
    const currentTurn = room.currentTurn;
    const currentPlayer = room.players.find(player => player.id === currentTurn?.id);

    if (!currentPlayer) throw new Error("Current player not found");

    let selectedCard;
    if (room.playedCards.length === 0) {
      const randomIndex = Math.floor(Math.random() * currentPlayer.cards.length);
      selectedCard = currentPlayer.cards[randomIndex];
    } else {
      const firstCard = room.playedCards[0];
      
      const sameSuitCards = currentPlayer.cards.filter(card => card.split('_of_')[1] === firstCard.suit);
      if (sameSuitCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * sameSuitCards.length);
        selectedCard = sameSuitCards[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * currentPlayer.cards.length);
        selectedCard = currentPlayer.cards[randomIndex];
      }
    }

    const data = {roomId, card: selectedCard, playerName: currentPlayer.name, playerId: currentPlayer.id}
    await handlePlayCard(socket, io, data as PlayCardEventData);

    await sendEncryptedEvent("thulla", "auto_card_played", { playedCard: selectedCard }, currentPlayer.socketId, io);
  } catch (error: any) {
    console.error("Error in createRoom handler:", error.message);
    await sendEncryptedEvent(
      "thulla",
      "error",
      { message: error.message },
      socket.id,
      io
    );
  }
}
