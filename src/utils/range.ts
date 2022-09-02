export function range(fromOrTo: number, to?: number): number[] {
  const result: number[] = [];
  const [start, stop] = to ? [fromOrTo, to] : [0, fromOrTo];
  for (let i = start; i <= stop; i++) result.push(i);
  return result;
}
