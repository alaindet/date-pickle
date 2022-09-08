// From
// https://stackblitz.com/edit/typescript-hikdqd?file=index.ts

export type Movement2D = (index: number) => number | null;

/**
 * Returns a collection of functions to move in a 2d grid
 * The 2d grid is represented as monodimensional array
 * size is array length
 * width is width of every row
 */
export const get2dMovements = (size: number, width: number): {
  up: Movement2D;
  right: Movement2D;
  down: Movement2D;
  left: Movement2D;
} => {

  const onSameRow = (a: number | null, b: number | null): boolean => {
    if (a === null || b === null) return false;
    if (a < 0 || a > size - 1) return false;
    if (b < 0 || b > size - 1) return false;
    return Math.floor(a / width) === Math.floor(b / width);
  };

  const up: Movement2D = fromIndex => {
    const toIndex = fromIndex - width;
    if (toIndex < 0) return null;
    return toIndex;
  };

  const right: Movement2D = fromIndex => {
    const toIndex = fromIndex + 1;
    if (!onSameRow(fromIndex, toIndex)) return null;
    return toIndex;
  };

  const down: Movement2D = fromIndex => {
    const toIndex = fromIndex + width;
    if (toIndex > size - 1) return null;
    return toIndex;
  };

  const left: Movement2D = fromIndex => {
    const toIndex = fromIndex - 1;
    if (!onSameRow(fromIndex, toIndex)) return null;
    return toIndex;
  };

  return { up, right, down, left };
};
