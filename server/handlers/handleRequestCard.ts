import { getRoom } from "../state/roomManager.ts";
import { getNextEligiblePlayer } from "../utils/helper.ts";

export function handleRequestCard(socket: any, io: any) {
  socket.on(
    "request_card",
    ({ roomId, playerId }: { roomId: string; playerId: string }) => {
      try {
        if (!roomId) throw new Error("Invalid play");

        const room = getRoom(roomId);
        if (!room) throw new Error("Room not found");

        const currentPlayer = room.players.find(
          (player) => player.id === playerId
        );
        if (!currentPlayer) throw new Error("Player not found");

        const nextPlayer = getNextEligiblePlayer(
          room,
          room.players.indexOf(currentPlayer)
        );
        io.to(nextPlayer.socketId).emit("request_received", {
          playerName: currentPlayer.name,
          RequesterPlayerId: currentPlayer.id,
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

export function handleApproveRequestCard(socket: any, io: any) {
  socket.on(
    "approve_hand_received",
    ({
      roomId,
      RequesterPlayerId,
      playerId,
    }: {
      roomId: string;
      RequesterPlayerId: string;
      playerId: string;
    }) => {
      try {
        if (!roomId) throw new Error("Invalid play");

        const room = getRoom(roomId);
        if (!room) throw new Error("Room not found");

        const requesterPlayer = room.players.find(
          (player) => player.id === RequesterPlayerId
        );
        if (!requesterPlayer) throw new Error("Requester Player not found");

        const currentPlayer = room.players.find(
          (player) => player.id === playerId
        );
        if (!currentPlayer) throw new Error("Player not found");

        requesterPlayer.cards = [
          ...requesterPlayer.cards,
          ...currentPlayer.cards,
        ];
        currentPlayer.cards = [];
        currentPlayer.isWon = true;

        io.to(roomId).emit("player_won", {
          playerName: currentPlayer.name,
          playerId: currentPlayer.id,
        });

        io.to(requesterPlayer.socketId).emit("hand_received", {
          currentTurn: room.currentTurn,
          hand: requesterPlayer.cards,
          opponents: room.players
            .filter((p) => p.id !== requesterPlayer.id)
            .map((opponent) => ({
              id: opponent.id,
              name: opponent.name,
              cardsCount: opponent.cards.length,
            })),
        });

        io.to(currentPlayer.socketId).emit("hand_received", {
          currentTurn: room.currentTurn,
          hand: currentPlayer.cards,
          opponents: room.players
            .filter((p) => p.id !== currentPlayer.id)
            .map((opponent) => ({
              id: opponent.id,
              name: opponent.name,
              cardsCount: opponent.cards.length,
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
