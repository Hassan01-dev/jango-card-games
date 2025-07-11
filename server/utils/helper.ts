import { Room } from "../types/thulla.ts";

export const generatRoomId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(6)); // 6 bytes = 48 bits
  return btoa(String.fromCharCode(...bytes)).replace(/[/+=]/g, '').slice(0, 8); // Safe, short string
};

export const getNextEligiblePlayer = (room: Room, startIndex: number) => {
  const players = room.players;
  let index = startIndex;
  let count = 0;

  while (count < players.length) {
    index = (index + 1) % players.length;
    if (index === startIndex) {
      continue;
    }
    const player = players[index];
    if (!player.isWon) return player;
    count++;
  }
  return players[startIndex]; // Fallback if no other eligible player found
}