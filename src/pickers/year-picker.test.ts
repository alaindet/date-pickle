import { YearItem } from '../types';
import { YearPicker } from './year-picker';

describe('YearPicker', () => {

  it('should return items around given year', () => {
    const d = new Date('2001-06-07');
    const picker = new YearPicker(d);
    const items = picker.getItems();
    const result = items.map(i => i.year);
    const expected = [
      1996, 1997, 1998,
      1999, 2000, 2001,
      2002, 2003, 2004,
      2005, 2006, 2007,
    ];
    expect(result).toEqual(expected);
  });

  it('should mark this year as current year', () => {
    const now = new Date();
    const picker = new YearPicker(now);
    const items = picker.getItems();
    const thisYear = now.getFullYear();
    const index = items.findIndex(i => i.year === thisYear);
    expect(items[index].isCurrent).toBeTruthy();
  });

  it('should disable items lower than min', () => {
    const d = new Date('2001-06-07');
    const picker = new YearPicker(d, false);
    picker.setMin(new Date('1999-06-07'));
    const items = picker.getItems();
    const year1998 = items[2];
    const year1999 = items[3];
    expect(year1998.isDisabled).toBeTruthy(); // < min
    expect(year1999.isDisabled).toBeFalsy(); // >= min
  });

  it('should disable items greater than max', () => {
    const d = new Date('2001-06-07');
    const picker = new YearPicker(d, false);
    picker.setMax(new Date('2003-06-07'));
    const items = picker.getItems();
    const year2003 = items[7];
    const year2004 = items[8];
    expect(year2003.isDisabled).toBeFalsy(); // <= max
    expect(year2004.isDisabled).toBeTruthy(); // > max
  });

  it('should trigger itemsChange event', async () => {
    const shouldUpdate = false;
    const picker = new YearPicker(new Date('2001-06-07'), shouldUpdate);
    const items = await new Promise<YearItem[]>((resolve, _) => {
      picker.onItemsChange(items => resolve(items));
      picker.updateItems();
    });
    expect(items.length).not.toEqual(0);
  });

  it('should show next years when calling next()', () => {
    const picker = new YearPicker(new Date('2000-01-01'));
    const lastYear1 = picker.getItems()[0].year;
    picker.next();
    const lastYear2 = picker.getItems()[0].year;
    expect(lastYear2).toEqual(lastYear1 + 12);
  });

  it('should show previous years when calling prev()', () => {
    const picker = new YearPicker(new Date('2000-01-01'));
    const lastYear1 = picker.getItems()[0].year;
    picker.prev();
    const lastYear2 = picker.getItems()[0].year;
    expect(lastYear2).toEqual(lastYear1 - 12);
  });

  it('should reset to now', () => {
    const year1970 = new Date(0);
    const thisYear = new Date().getFullYear();
    const picker = new YearPicker(year1970);
    const items1970 = picker.getItems().map(i => i.year);
    expect(items1970).not.toContainEqual(thisYear);
    picker.setNow();
    const items = picker.getItems().map(i => i.year);
    expect(items).toContainEqual(thisYear);
  });
});

export {};
