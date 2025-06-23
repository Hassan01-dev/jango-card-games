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
  
  function parseCard(cardStr) {
    const [rank, , suit] = cardStr.split("_"); // e.g. "jack_of_hearts" → ["jack", "of", "hearts"]
    return {
      rank,
      suit,
      value: rankOrder[rank.toLowerCase()],
    };
  }
  
  /**
   * Determines winner of the round and if Thulla occurred.
   * @param {Array<{ card: string, playerName: string, socketId: string }>} trick
   * @returns {{ winner: string, thullaOccurred: boolean }}
   */
  function determineTrickWinnerWithThulla(trick) {
    const parsedTrick = trick.map(entry => {
      const parsed = parseCard(entry.card);
      return { ...entry, ...parsed };
    });
  
    const leadSuit = parsedTrick[0].suit;
  
    // Check if anyone did not follow lead suit
    const thullaOccurred = parsedTrick.some(c => c.suit !== leadSuit);
  
    // Filter only lead suit cards
    const leadSuitPlays = parsedTrick.filter(c => c.suit === leadSuit);
  
    if (leadSuitPlays.length === 0) {
      throw new Error("No cards with lead suit — invalid round.");
    }
  
    const highest = leadSuitPlays.reduce((max, curr) =>
      curr.value > max.value ? curr : max
    );
  
    return {
      winner: highest.playerName,
      thullaOccurred,
    };
  }
  
  module.exports = determineTrickWinnerWithThulla;
  