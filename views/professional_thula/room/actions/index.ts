"use server"

import { connect } from "@config/db/dbConfig";
import CardGame from "@config/db/models/cardGame";
import { CardDeck } from "@/utils/cardDeck";
import { cookies } from "next/headers";

export const startGame = async (roomId: string, playerNames: string[]) => {
  connect();

  try {
    const cardGame = await CardGame.findById(roomId);
    if (!cardGame) {
      throw new Error('Card game not found');
    }

    const currentDeck = new CardDeck();
    currentDeck.shuffleDeck();
    const hands = currentDeck.distributeCards(playerNames);
    cardGame.playerNames = [...playerNames];
    cardGame.hands = [...hands];
    cardGame.isStarted = true;
    
    await cardGame.save();
  } catch (error) {
    console.error('Error starting game:', error);
  }
};

export const getCookie = (key: string) => {
  return cookies().get(key)?.value;
}