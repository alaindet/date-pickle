import { capitalize } from './capitalize';

describe('capitalize() utility function', () => {

  it('should capitalize a full caps word', () => {
    const result = capitalize('SCREAMING');
    const expected = 'Screaming';
    expect(result).toEqual(expected);
  });

  it('should capitalize a lowercase word', () => {
    const result = capitalize('whispering');
    const expected = 'Whispering';
    expect(result).toEqual(expected);
  });

  it('should capitalize a mixed case word', () => {
    const result = capitalize('sTrAnGe!');
    const expected = 'Strange!';
    expect(result).toEqual(expected);
  });

  it('should capitalize localized strings', () => {
    const result = capitalize('àèìòù');
    const expected = 'Àèìòù';
    expect(result).toEqual(expected);
  });
});
