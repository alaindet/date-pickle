export function padStart(n: number, fill: string, len: number): string {
  let r = `${n}`;
  if (r.length < len) r = `${fill.repeat(len - r.length)}${r}`;
  return r;
}
