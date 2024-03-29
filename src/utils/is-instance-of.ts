/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T> = new (...args: any[]) => T;

export function isInstanceOf(obj: any, classType: Constructor<any>): boolean {
  return obj instanceof classType;
}
