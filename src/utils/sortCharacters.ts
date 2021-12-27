/**
 * Helper function to make sure hashed JSONS don't differ because of different order of fields
 */
export default function sortCharacters(data: unknown): string {
  return JSON.stringify(data).split('').sort().join('');
}