export const generatRoomId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(6)); // 6 bytes = 48 bits
  return btoa(String.fromCharCode(...bytes)).replace(/[/+=]/g, '').slice(0, 8); // Safe, short string
};
