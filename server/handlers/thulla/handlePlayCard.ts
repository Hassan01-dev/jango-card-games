import { parseCard } from "../../utils/parseCard.ts";
import { getThullaRoom } from "../../state/roomManager.ts";
import { getNextEligiblePlayer } from "../../utils/helper.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";
import { PlayCardEventData } from "../../types/main.ts";

async function waitFor() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

export async function handlePlayCard(
  socket: any,
  io: any,
  data: PlayCardEventData
) {
  const { roomId, card, playerName, playerId } = data;
  try {
    if (!roomId || !card || !playerName) throw new Error("Invalid play");

    const room = getThullaRoom(roomId);
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

    await sendEncryptedEvent("thulla", "play_card", { playerName, card }, roomId, io);
    const currentPlayer = room.players.find((p) => p.id === playerId);

    if (currentPlayer) {
      currentPlayer.cards = currentPlayer.cards.filter((c) => c !== card);
    }

    const leadSuit = room.playedCards[0].suit;
    const highest = room.playedCards.reduce((max, curr) =>
      curr.suit === leadSuit && curr.value > max.value ? curr : max
    );

    // 🔥 Thulla detection
    if (parsed.suit !== leadSuit && !room.isFirstTurn) {
      await waitFor();
      await sendEncryptedEvent("thulla", "play_card", { playerName, card }, roomId, io);
      for (const player of room.players) {
        if (player.cards.length === 0 && !player.isWon) {
          player.isWon = true;
          await sendEncryptedEvent("thulla", "player_won", { playerName: player.name }, roomId, io);
          await sendEncryptedEvent("thulla", "game_won", {}, player.socketId, io);
        }
      }

      const remainingPlayers = room.players.filter((player) => !player.isWon);
      if (remainingPlayers.length === 1) {
        await sendEncryptedEvent(
          "thulla",
          "game_over",
          { looser: remainingPlayers[0].name },
          roomId,
          io
        );
        return
      }

      await sendEncryptedEvent(
        "thulla",
        "thulla",
        {
          triggeredBy: playerName,
          looser: highest.playerName,
          cardsTaken: room.playedCards.length,
        },
        roomId,
        io
      );

      await sendEncryptedEvent(
        "thulla",
        "cards_taken",
        {
          cards: room.playedCards.map((c) => c.card),
        },
        highest.socketId,
        io
      );

      const highestPlayer = room.players.find((p) => p.id === highest.playerId);
      if (highestPlayer) {
        highestPlayer.cards = [
          ...highestPlayer.cards,
          ...room.playedCards.map((c) => c.card),
        ];
      }

      room.playedCards = [];
      room.noOfTurns = 0;

      room.currentTurn = { id: highest.playerId, name: highest.playerName };
      const nextNextPlayer = getNextEligiblePlayer(room, room.players.findIndex((p) => p.id === highest.playerId) + 1);
      await sendEncryptedEvent(
        "thulla",
        "update_turn",
        {
          currentTurn: room.currentTurn,
          nextTurn: { id: nextNextPlayer?.id, name: nextNextPlayer?.name },
          playersDetail: room.players.map((p) => ({
            id: p.id,
            name: p.name,
            cardsCount: p.cards.length,
          })),
        },
        roomId,
        io
      );

      return;
    }

    room.noOfTurns += 1;

    const activePlayers = room.players.filter((p) => !p.isWon);

    if (room.noOfTurns === activePlayers.length) {
      room.playedCards = [];
      room.noOfTurns = 0;
      room.isFirstTurn = false;
      await waitFor();
      await sendEncryptedEvent("thulla", "empty_table", {}, roomId, io);

      for (const player of room.players) {
        if (player.cards.length === 0 && !player.isWon) {
          player.isWon = true;
          await sendEncryptedEvent("thulla", "player_won", { playerName: player.name }, roomId, io);
          await sendEncryptedEvent("thulla", "game_won", {}, player.socketId, io);
        }
      }

      const remainingPlayers = room.players.filter((player) => !player.isWon);
      if (remainingPlayers.length === 1) {
        await sendEncryptedEvent(
          "thulla",
          "game_over",
          { looser: remainingPlayers[0].name },
          roomId,
          io
        );
        return
      }

      let nextTurnPlayer = room.players.find((p) => p.id === highest.playerId);
      let nextNextPlayer;
      if (!nextTurnPlayer || nextTurnPlayer.isWon) {
        const startIndex = room.players.findIndex((p) => p.id === playerId);
        nextTurnPlayer = getNextEligiblePlayer(room, startIndex);
        nextNextPlayer = getNextEligiblePlayer(room, startIndex + 1);
      }

      if (!nextTurnPlayer) {
        throw new Error("No next turn player found");
      }
      room.currentTurn = {
        id: nextTurnPlayer.id,
        name: nextTurnPlayer.name,
      };

      await sendEncryptedEvent(
        "thulla",
        "update_turn",
        {
          currentTurn: room.currentTurn,
          nextTurn: { id: nextNextPlayer?.id, name: nextNextPlayer?.name },
          playersDetail: room.players.map((p) => ({
            id: p.id,
            name: p.name,
            cardsCount: p.cards.length,
          })),
        },
        roomId,
        io
      );

      return;
    }

    // Pass to next eligible player
    const currentIndex = room.players.findIndex((p) => p.id === playerId);
    const nextPlayer = getNextEligiblePlayer(room, currentIndex);
    const nextNextPlayer = getNextEligiblePlayer(room, currentIndex + 1);
    if (!nextPlayer) {
      throw new Error("No next player found");
    }

    room.currentTurn = { id: nextPlayer.id, name: nextPlayer.name };
    await sendEncryptedEvent(
      "thulla",
      "update_turn",
      {
        currentTurn: room.currentTurn,
        nextTurn: nextNextPlayer,
        playersDetail: room.players.map((p) => ({
          id: p.id,
          name: p.name,
          cardsCount: p.cards.length,
        })),
      },
      roomId,
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
