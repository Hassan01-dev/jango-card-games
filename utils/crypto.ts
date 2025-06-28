// utils/crypto.ts

const getCryptoKey = async (secret: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
};

export const encryptPayload = async (data: unknown): Promise<string> => {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const jsonData = encoder.encode(JSON.stringify(data));

  const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!secret) throw new Error("Missing NEXT_PUBLIC_SECRET_KEY");

  const key = await getCryptoKey(secret);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, jsonData);

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Convert to base64 string for transport
  return btoa(String.fromCharCode.apply(null, Array.from(combined)));
};

// Decryption
export const decryptPayload = async (cipherText: string): Promise<unknown> => {
  const decoder = new TextDecoder();

  const combined = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
  if (!secret) throw new Error("Missing NEXT_PUBLIC_SECRET_KEY");

  const key = await getCryptoKey(secret);

  const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);
  const decryptedText = decoder.decode(decryptedBuffer);

  return JSON.parse(decryptedText);
};
