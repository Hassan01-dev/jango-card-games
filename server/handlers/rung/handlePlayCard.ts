import { parseCard } from "../../utils/parseCard.ts";
import { getRungRoom } from "../../state/rungRoomManager.ts";
import { getNextEligiblePlayer } from "../../utils/helper.ts";
import { sendEncryptedEvent } from "../../utils/socketResponse.ts";
import { PlayCardEventData } from "../../types/main.ts";
import { RungPlayer } from "../../types/rung.ts";

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

    const room = getRungRoom(roomId);
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

    await sendEncryptedEvent("rung", "play_card", { playerName, card }, roomId, io);
    const currentPlayer = room.players.find((p) => p.id === playerId);

    if (currentPlayer) {
      currentPlayer.cards = currentPlayer.cards.filter((c) => c !== card);
    }

    const leadSuit = room.playedCards[0].suit;
    const highest = room.playedCards.reduce((max, curr) => {
      // Check if current or max is rungSuit
      const currIsRung = curr.suit === room.rungSuit;
      const maxIsRung = max.suit === room.rungSuit;
    
      if (currIsRung && !maxIsRung) return curr;      // rungSuit beats non-rung
      if (!currIsRung && maxIsRung) return max;       // non-rung loses to rung
    
      // If neither are rungSuit, prioritize leadSuit
      const currIsLead = curr.suit === leadSuit;
      const maxIsLead = max.suit === leadSuit;
    
      if (currIsLead && !maxIsLead) return curr;      // leadSuit beats other suits
      if (!currIsLead && maxIsLead) return max;       // other suits lose to leadSuit
    
      // If both are same suit (rungSuit or leadSuit), highest value wins
      return curr.value > max.value ? curr : max;
    });

    room.noOfCardsOnTable += 1;

    if (room.noOfCardsOnTable === room.players.length) {
      room.playedCards = [];
      room.noOfCardsOnTable = 0;
      room.noOfTurnsOnTable += 1;
      await waitFor();

      if(room.noOfTurns >= 4) {
        if(room.lastHighestPlayer?.id === highest.playerId){
          const team = room.lastHighestPlayer.team;
          if(team === 'red'){
            room.redTeamScore += room.noOfTurnsOnTable;
          } else {
            room.blueTeamScore += room.noOfTurnsOnTable;
          }
          room.noOfTurnsOnTable = 0;
          room.lastHighestPlayer = null;
          await sendEncryptedEvent("rung", "team_score", { team, score: room.noOfTurnsOnTable, redTeamScore: room.redTeamScore, blueTeamScore: room.blueTeamScore }, roomId, io);
        } else {
          room.lastHighestPlayer = {
            id: highest.playerId,
            name: highest.playerName,
            team: room.players.find((p) => p.id === highest.playerId)?.team as 'red' | 'blue'
          };
        }
      }
      await sendEncryptedEvent("rung", "empty_table", {}, roomId, io);

      room.noOfTurns += 1;
      let nextTurnPlayer = room.players.find((p) => p.id === highest.playerId);
      let nextNextPlayer;
      if (!nextTurnPlayer) {
        const startIndex = room.players.findIndex((p) => p.id === playerId);
        nextTurnPlayer = getNextEligiblePlayer(room, startIndex) as RungPlayer;
        nextNextPlayer = getNextEligiblePlayer(room, startIndex + 1) as RungPlayer;
      }

      room.currentTurn = {
        id: nextTurnPlayer.id,
        name: nextTurnPlayer.name,
      };

      await sendEncryptedEvent(
        "rung",
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

    room.currentTurn = { id: nextPlayer.id, name: nextPlayer.name };
    await sendEncryptedEvent(
      "rung",
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
