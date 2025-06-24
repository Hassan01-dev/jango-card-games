const rankOrder = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "jack": 11,
    "queen": 12,
    "king": 13,
    "ace": 14,
  };
  
  export function parseCard(cardStr: string) {
    const [rank, , suit] = cardStr.split("_"); // e.g. "jack_of_hearts"
    return {
      rank,
      suit,
      value: rankOrder[rank.toLowerCase() as keyof typeof rankOrder]
    };
  }
  

  