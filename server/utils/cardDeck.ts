import { GulamChorPlayer } from "../types/gulamChor.ts";
import { ThullaPlayer } from "../types/thulla.ts";

const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
  "ace",
];

export class CardDeck {
  private cards: string[];

  constructor() {
    this.cards = [];

    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.cards = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(`${rank}_of_${suit}`);
      }
    }
  }

  public dealCard(): string | null {
    if (this.cards.length === 0) {
      return null;
    }

    return this.cards.pop()!;
  }

  public shuffleDeck(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  public distributeCardsForThulla(players: ThullaPlayer[]): ThullaPlayer {
    const numPlayers = players.length;
    let firstTurn;

    while (this.cards.length > 0) {
      for (let i = 0; i < numPlayers && this.cards.length > 0; i++) {
        const card = this.dealCard()!;
        if (card === "ace_of_spades") {
          firstTurn = players[i];
        } else {
          players[i].cards.push(card);
        }
      }
    }

    return firstTurn;
  }

  public distributeCardsForGulamChor(players: GulamChorPlayer[], card?: string): string {
    const numPlayers = players.length;
    let excludedCard: string;
    let cardIndex: number;

    if (!card) {
      cardIndex = Math.floor(Math.random() * this.cards.length);
      excludedCard = this.cards[cardIndex];
    } else {
      excludedCard = card;
      cardIndex = this.cards.indexOf(card);
    }
    this.cards.splice(cardIndex, 1);

    let playerIndex = 0;
    while (this.cards.length > 0) {
      const dealtCard = this.dealCard()!;
      players[playerIndex].cards.push(dealtCard);
      playerIndex = (playerIndex + 1) % numPlayers;
    }

    return excludedCard;
  }

  public resetDeck(): void {
    this.initializeDeck();
    this.shuffleDeck();
  }
}
