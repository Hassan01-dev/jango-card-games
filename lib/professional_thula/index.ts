import { CardDeck } from "@/lib/shared/cardDeck";
import { GameSettingType } from "./type";
const { v4: uuidv4 } = require("uuid");

export const createGame = (setting: GameSettingType) => {
  const { playersName } = setting;
  const currentDeck = new CardDeck();
  currentDeck.shuffleDeck();
  const hands = currentDeck.distributeCards(playersName);
  const roomId = uuidv4();
  window.sessionStorage.setItem(roomId, JSON.stringify({ ...setting, hands }));
  return roomId;
};
