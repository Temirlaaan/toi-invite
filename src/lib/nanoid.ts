import { randomBytes } from "crypto";

const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyz";

export function nanoid(size = 10): string {
  const bytes = randomBytes(size);
  let id = "";
  for (let i = 0; i < size; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}
