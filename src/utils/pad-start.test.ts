import { padStart } from './pad-start';

describe('padStart() utility function', () => {

  it('should pad left', () => {

    const testCases: {
      input: [number, string, number];
      expected: string;
    }[] = [
      {
        input: [42, '0', 4],
        expected: '0042',
      },
      {
        input: [99, '0', 2],
        expected: '99',
      },
      {
        input: [999, '*', 2],
        expected: '999',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = padStart(...input);
      expect(result).toEqual(expected);
    });
  });
});

export {};
