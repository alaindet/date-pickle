import { get2dMovements } from './2d-movements';

describe('get2dMovements() utility function', () => {

  const getTestGrid = () => [
    'a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
  ];

  it('should move up', () => {

    const grid = getTestGrid();

    const testCases = [
      ['a', null], // top-left corner
      ['e', null], // top-right corner
      ['t', 'o'], // bottom-right-corner
      ['p', 'k'], // bottom-left corner
      ['f', 'a'], // left border
      ['o', 'j'], // right border
      ['h', 'c'], // in the middle
    ];

    const { up } = get2dMovements(grid.length, 5);

    testCases.forEach(([input, expected]) => {
      const fromIndex = grid.findIndex(letter => letter === input);
      const toIndex = up(fromIndex);
      const result = toIndex === null ? null : grid[toIndex];
      expect(result).toEqual(expected);
    });
  });

  it('should move right', () => {

    const grid = getTestGrid();

    const testCases = [
      ['a', 'b'], // top-left corner
      ['e', null], // top-right corner
      ['t', null], // bottom-right corner
      ['p', 'q'], // bottom-left corner
      ['f', 'g'], // left border
      ['o', null], // right border
      ['h', 'i'], // in the middle
    ];

    const { right } = get2dMovements(grid.length, 5);

    testCases.forEach(([input, expected]) => {
      const fromIndex = grid.findIndex(letter => letter === input);
      const toIndex = right(fromIndex);
      const result = toIndex === null ? null : grid[toIndex];
      expect(result).toEqual(expected);
    });
  });

  it('should move down', () => {

    const grid = getTestGrid();

    const testCases = [
      ['a', 'f'], // top-left corner
      ['e', 'j'], // top-right corner
      ['t', null], // bottom-right-corner
      ['p', null], // bottom-left corner
      ['f', 'k'], // left border
      ['o', 't'], // right border
      ['h', 'm'], // in the middle
    ];

    const { down } = get2dMovements(grid.length, 5);

    testCases.forEach(([input, expected]) => {
      const fromIndex = grid.findIndex(letter => letter === input);
      const toIndex = down(fromIndex);
      const result = toIndex === null ? null : grid[toIndex];
      expect(result).toEqual(expected);
    });
  });

  it('should move left', () => {

    const grid = getTestGrid();

    const testCases = [
      ['a', null], // top-left corner
      ['e', 'd'], // top-right corner
      ['t', 's'], // bottom-right-corner
      ['p', null], // bottom-left corner
      ['f', null], // left border
      ['o', 'n'], // right border
      ['h', 'g'], // in the middle
    ];

    const { left } = get2dMovements(grid.length, 5);

    testCases.forEach(([input, expected]) => {
      const fromIndex = grid.findIndex(letter => letter === input);
      const toIndex = left(fromIndex);
      const result = toIndex === null ? null : grid[toIndex];
      expect(result).toEqual(expected);
    });
  });
});
