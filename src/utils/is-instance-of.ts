type Constructor<T> = new (...args: unknown[]) => T;

export function isInstanceOf(
  obj: unknown,
  classType: Constructor<unknown>
): boolean {
  return obj instanceof classType;
}
