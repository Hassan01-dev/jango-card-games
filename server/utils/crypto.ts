// crypto.ts
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encryptPayload(data: unknown): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const json = encoder.encode(JSON.stringify(data));
  const secret = Deno.env.get("SECRET_KEY") || "";
  if (!secret) throw new Error("Missing SECRET_KEY");

  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const key = await crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["encrypt"]);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, json);

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptPayload(cipherText: string): Promise<unknown> {
  const bytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
  const iv = bytes.slice(0, 12);
  const encrypted = bytes.slice(12);
  const secret = Deno.env.get("SECRET_KEY")
  if (!secret) throw new Error("Missing SECRET_KEY");

  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  const key = await crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["decrypt"]);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
  return JSON.parse(decoder.decode(decrypted));
}
