export function capitalize(word: string): string {
  const w = word.toLocaleLowerCase();
  return w[0].toLocaleUpperCase() + w.slice(1);
}
