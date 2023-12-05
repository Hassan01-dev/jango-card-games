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

interface PlayerHand {
  name: string;
  cards: string[];
}

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
      console.log("No more cards in the deck");
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
  
  public distributeCards(playersName: string[]): PlayerHand[] {
    const numPlayers = playersName.length
    if (numPlayers <= 0) {
      console.log("Invalid number of players");
      return [];
    }
  
    const playerHands: PlayerHand[] = playersName.map((name) => ({ name, cards: [] }));
  
    while (this.cards.length > 0) {
      for (let i = 0; i < numPlayers && this.cards.length > 0; i++) {
        const card = this.dealCard()!;
        playerHands[i].cards.push(card);
      }
    }
  
    return playerHands;
  }

  public resetDeck(): void {
    this.initializeDeck();
    this.shuffleDeck();
  }
}
