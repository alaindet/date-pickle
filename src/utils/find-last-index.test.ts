import { findLastIndex } from './find-last-index';

describe('findLastIndex() utility function', () => {

  const getItems = () => [
    { id: 1, name: 'Item #1', someFlag: true },
    { id: 2, name: 'Item #2', someFlag: false },
    { id: 3, name: 'Item #3', someFlag: true },
    { id: 4, name: 'Item #4', someFlag: false },
  ];

  it('should find last index of valid item', () => {
    const items = getItems();
    const expected = 2;
    const result = findLastIndex(items, item => item.someFlag);
    expect(result).toEqual(expected);
  });

  it('should fail the search if no item is valid', () => {
    const items = getItems();
    const expected = -1;
    const result = findLastIndex(items, item => item.id === 42);
    expect(result).toEqual(expected);
  });

});
