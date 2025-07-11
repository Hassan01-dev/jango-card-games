import { getRoom } from "../../state/roomManager.ts";
import { ApproveRequestCardEventData, RejectRequestCardEventData, RequestCardEventData } from "../../types/thulla.ts";
import { getNextEligiblePlayer } from "../../utils/helper.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";

export async function handleRequestCard(
  socket: any,
  io: any,
  data: RequestCardEventData
) {
  const { roomId, playerId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const currentPlayer = room.players.find((player) => player.id === playerId);
    if (!currentPlayer) throw new Error("Player not found");

    const nextPlayer = getNextEligiblePlayer(
      room,
      room.players.indexOf(currentPlayer)
    );

    await sendEncryptedEvent(
      "thulla",
      "request_received",
      {
        playerName: currentPlayer.name,
        playerId: currentPlayer.id,
      },
      nextPlayer.socketId,
      io
    );
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

export async function handleApproveRequestCard(
  socket: any,
  io: any,
  data: ApproveRequestCardEventData
) {
  const { roomId, playerId, requesterPlayerId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const requesterPlayer = room.players.find(
      (player) => player.id === requesterPlayerId
    );
    if (!requesterPlayer) throw new Error("Requester Player not found");

    const currentPlayer = room.players.find((player) => player.id === playerId);
    if (!currentPlayer) throw new Error("Player not found");

    requesterPlayer.cards = [...requesterPlayer.cards, ...currentPlayer.cards];
    currentPlayer.cards = [];
    currentPlayer.isWon = true;

    await sendEncryptedEvent(
      "thulla",
      "player_won",
      {
        playerName: currentPlayer.name,
        playerId: currentPlayer.id,
      },
      roomId,
      io
    );

    await sendEncryptedEvent(
      "thulla",
      "hand_received",
      {
        currentTurn: room.currentTurn,
        hand: requesterPlayer.cards,
        opponents: room.players
          .filter((p) => p.id !== requesterPlayer.id)
          .map((opponent) => ({
            id: opponent.id,
            name: opponent.name,
            cardsCount: opponent.cards.length,
          })),
      },
      requesterPlayer.socketId,
      io
    );

    await sendEncryptedEvent(
      "thulla",
      "hand_received",
      {
        currentTurn: room.currentTurn,
        hand: currentPlayer.cards,
        opponents: room.players
          .filter((p) => p.id !== currentPlayer.id)
          .map((opponent) => ({
            id: opponent.id,
            name: opponent.name,
            cardsCount: opponent.cards.length,
          })),
      },
      currentPlayer.socketId,
      io
    );
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

export async function handleRejectRequestCard(
  socket: any,
  io: any,
  data: RejectRequestCardEventData
) {
  const { roomId, playerName, requesterPlayerId } = data;
  try {
    if (!roomId) throw new Error("Invalid play");

    const room = getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const requesterPlayer = room.players.find(
      (player) => player.id === requesterPlayerId
    );
    if (!requesterPlayer) throw new Error("Requester Player not found");

    await sendEncryptedEvent(
      "thulla",
      "request_rejected",
      {
        playerName,
      },
      requesterPlayer.socketId,
      io
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendEncryptedEvent(
        "thulla",
        "error",
        { message: error.message },
        socket.id,
        io
      );
    }
  }
}
