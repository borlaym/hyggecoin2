import sortCharacters from "./sortCharacters";

const crypto = require('crypto');

export function hash(data: unknown): string {
  const serialized = sortCharacters(data);
  const hash = crypto.createHash('sha3-256');
  hash.update(serialized);
  return hash.digest('hex');
}