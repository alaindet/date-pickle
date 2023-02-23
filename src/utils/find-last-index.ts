// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findLastIndex<T = any>(
  arr: T[],
  fn: (item: T) => boolean
): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (fn(arr[i])) {
      return i;
    }
  }

  return -1;
}
