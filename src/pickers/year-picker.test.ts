import { YearItem } from '../types';
import { comparableDate, range } from '../utils';
import { YearPicker } from './year-picker';

const comparable = (d: Date) => comparableDate(d, 'year');

describe('YearPicker', () => {

  it('should return items around given year', () => {
    const picker = new YearPicker(new Date('2001-06-07'));
    const result = picker.items!.map(i => i.year);
    const expected = range(1996, 2007);
    expect(result).toEqual(expected);
  });

  it('should mark this year with isNow = true', () => {
    const now = new Date();
    const picker = new YearPicker(now);
    const items = picker.items!;
    const thisYear = now.getUTCFullYear();
    const index = items!.findIndex(i => i.year === thisYear);
    expect(items[index].isNow).toBeTruthy();
  });

  it('should disable items lower than min', () => {
    const d = new Date('2001-06-07');
    const min = new Date('1999-06-07');
    const picker = new YearPicker(d, { min });
    const items = picker.items!;
    const year1998 = items[2];
    const year1999 = items[3];
    expect(year1998.isDisabled).toBeTruthy(); // < min
    expect(year1999.isDisabled).toBeFalsy(); // >= min
  });

  it('should disable items greater than max', () => {
    const d = new Date('2001-06-07');
    const max = new Date('2003-06-07');
    const picker = new YearPicker(d, { max });
    picker.sync = true;
    const items = picker.items!;
    const year2003 = items[7];
    const year2004 = items[8];
    expect(year2003.isDisabled).toBeFalsy(); // <= max
    expect(year2004.isDisabled).toBeTruthy(); // > max
  });

  it('should trigger onItemsChange', async () => {
    const picker = new YearPicker(new Date('2001-06-07'), { sync: false });
    const items = await new Promise<YearItem[]>((resolve, _) => {
      picker.onItemsChange(items => resolve(items));
      picker.sync = true;
    });
    expect(items.length).not.toEqual(0);
  });

  it('should trigger onSelected', async () => {
    const d = new Date('2022-09-05');
    const picker = new YearPicker();
    const selected = await new Promise<Date | undefined>((resolve, _) => {
      picker.onSelected(selected => resolve(selected));
      picker.selected = d;
    });
    expect(selected).toBeTruthy();
    expect(comparable(selected!)).toEqual(comparable(d));
  });

  it('should trigger onFocused', async () => {
    const d = new Date('2022-09-05');
    const picker = new YearPicker();
    const focused = await new Promise<Date | undefined>((resolve, _) => {
      picker.onFocused(focused => resolve(focused));
      picker.focused = d;
    });
    expect(focused).toBeTruthy();
    expect(comparable(focused!)).toEqual(comparable(d));
  });

  it('should show next years when calling next()', () => {
    const picker = new YearPicker(new Date('2000-01-01'));
    const lastYear1 = picker.items![0].year;
    picker.next();
    const lastYear2 = picker.items![0].year;
    expect(lastYear2).toEqual(lastYear1 + 12);
  });

  it('should show previous years when calling prev()', () => {
    const picker = new YearPicker(new Date('2000-01-01'));
    const lastYear1 = picker.items![0].year;
    picker.prev();
    const lastYear2 = picker.items![0].year;
    expect(lastYear2).toEqual(lastYear1 - 12);
  });

  it('should reset to now', () => {
    const year1970 = new Date(0);
    const thisYear = new Date().getFullYear();
    const picker = new YearPicker(year1970);
    const items1970 = picker.items!.map(i => i.year);
    expect(items1970).not.toContainEqual(thisYear);
    picker.now();
    const items = picker.items!.map(i => i.year);
    expect(items).toContainEqual(thisYear);
  });

  it('should select given year via options', () => {
    const d = new Date('2022-02-02');
    const selected = new Date('2020-02-02');
    const picker = new YearPicker(d, { selected });
    const items = picker.items!;
    const year2020 = items.find(y => y.year === 2020);
    const year2022 = items.find(y => y.year === 2022);
    expect(year2020?.isSelected).toBeTruthy();
    expect(year2022?.isSelected).toBeFalsy();
  });

  it('should select given year via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new YearPicker(d);
    picker.selected = new Date('2020-02-02');
    const items = picker.items!;
    const year2020 = items.find(y => y.year === 2020);
    const year2022 = items.find(y => y.year === 2022);
    expect(year2020?.isSelected).toBeTruthy();
    expect(year2022?.isSelected).toBeFalsy();
  });

  it('should focus given year via options', () => {
    const d = new Date('2022-02-02');
    const focused = new Date('2020-02-02');
    const picker = new YearPicker(d, { focused });
    const items = picker.items!;
    const year2020 = items.find(y => y.year === 2020);
    const year2022 = items.find(y => y.year === 2022);
    expect(year2020?.isFocused).toBeTruthy();
    expect(year2022?.isFocused).toBeFalsy();
  });

  it('should focus given year via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new YearPicker(d);
    picker.focused = new Date('2020-02-02');
    const items = picker.items!;
    const year2020 = items.find(y => y.year === 2020);
    const year2022 = items.find(y => y.year === 2022);
    expect(year2020?.isFocused).toBeTruthy();
    expect(year2022?.isFocused).toBeFalsy();
  });
});

export {};
