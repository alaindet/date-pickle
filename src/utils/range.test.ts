import { range } from './range';

describe('range() utility function', () => {

  it('should return first 10 natural numbers including 0', () => {
    expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should return numbers between 42 and 47', () => {
    expect(range(42, 47)).toEqual([42, 43, 44, 45, 46, 47]);
  });
});

export {};
