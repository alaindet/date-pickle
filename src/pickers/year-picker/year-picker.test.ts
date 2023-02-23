import { TIME_INTERVAL, YearItem } from '../../types';
import { comparableDate, range } from '../../utils';
import { YearPicker } from './year-picker';
import { expectFocusedDateToEqual } from '../../tests/matchers';

const comparable = (d: Date) => comparableDate(d, 'year');

describe('YearPicker', () => {

  it('should return years in the given decade', () => {
    const picker = new YearPicker(new Date('2001-06-07'));
    const result = picker.items!.map(i => i.date.getUTCFullYear());
    const expected = range(2000, 2011);
    expect(result).toEqual(expected);
  });

  it('should mark this year with isNow = true', () => {
    const now = new Date();
    const picker = new YearPicker(now);
    const items = picker.items!;
    const thisYear = now.getUTCFullYear();
    const index = items!.findIndex(i => i.date.getUTCFullYear() === thisYear);
    expect(items[index].isNow).toBeTruthy();
  });

  it('should disable years lower than min', () => {
    const d = new Date('2006-01-02');
    const min = new Date('2003-08-08');
    const picker = new YearPicker(d, { min });
    const items = picker.items!;
    const year2002 = items[2];
    const year2003 = items[3];
    expect(year2002.isDisabled).toBeTruthy(); // < min
    expect(year2003.isDisabled).toBeFalsy(); // >= min
  });

  it('should disable years greater than max', () => {
    const d = new Date('2006-01-02');
    const max = new Date('2008-10-10');
    const picker = new YearPicker(d, { max });
    const items = picker.items!;
    const year2008 = items[8];
    const year2009 = items[9];
    expect(year2008.isDisabled).toBeFalsy(); // <= max
    expect(year2009.isDisabled).toBeTruthy(); // > max
  });

  it('should trigger onItemsChange', async () => {
    const picker = new YearPicker();
    const items = await new Promise<YearItem[]>(done => {
      const immediate = true;
      picker.onItemsChange(items => done(items), immediate);
    });
    expect(items.length).not.toEqual(0);
  });

  it('should trigger onSelectedChange', async () => {
    const d = new Date('2022-09-05');
    const picker = new YearPicker();
    const selected = await new Promise<Date | undefined>((resolve, _) => {
      picker.onSelectedChange(selected => resolve(selected));
      picker.selected = d;
    });
    expect(selected).toBeTruthy();
    expect(comparable(selected!)).toEqual(comparable(d));
  });

  it('should trigger onFocusedChange', async () => {
    const d = new Date('2022-09-05');
    const picker = new YearPicker();
    const focused = await new Promise<Date | undefined>((resolve, _) => {
      picker.onFocusedChange(focused => resolve(focused));
      picker.focused = d;
    });
    expect(focused).toBeTruthy();
    expect(comparable(focused!)).toEqual(comparable(d));
  });

  it('should show next years when calling next()', () => {
    const picker = new YearPicker(new Date('2000-01-01'));
    const firstYearBefore = picker.items![0].date.getUTCFullYear();
    picker.next();
    const firstYearAfter = picker.items![0].date.getUTCFullYear();
    expect(firstYearAfter).toEqual(firstYearBefore + 10);
  });

  it('should show previous years when calling prev()', () => {
    const picker = new YearPicker(new Date('2000-01-01'));
    const firstYearBefore = picker.items![0].date.getUTCFullYear();
    picker.prev();
    const firstYearAfter = picker.items![0].date.getUTCFullYear();
    expect(firstYearAfter).toEqual(firstYearBefore - 10);
  });

  it('should reset to now', () => {
    const year1970 = new Date(0);
    const thisYear = new Date().getFullYear();
    const picker = new YearPicker(year1970);
    const items1970 = picker.items!.map(i => i.date.getUTCFullYear());
    expect(items1970).not.toContainEqual(thisYear);
    picker.now();
    const items = picker.items!.map(i => i.date.getUTCFullYear());
    expect(items).toContainEqual(thisYear);
  });

  it('should select given year via options', () => {
    const d = new Date('2022-02-02');
    const selected = new Date('2020-02-02');
    const picker = new YearPicker(d, { selected });
    const items = picker.items!;
    const year2020 = items.find(y => y.date.getUTCFullYear() === 2020);
    const year2022 = items.find(y => y.date.getUTCFullYear() === 2022);
    expect(year2020?.isSelected).toBeTruthy();
    expect(year2022?.isSelected).toBeFalsy();
  });

  it('should focus given year via options', () => {
    const d = new Date('2022-02-02');
    const focused = new Date('2020-02-02');
    const picker = new YearPicker(d, { focused });
    const items = picker.items!;
    const year2020 = items.find(y => y.date.getUTCFullYear() === 2020);
    const year2022 = items.find(y => y.date.getUTCFullYear() === 2022);
    expect(year2020?.isFocused).toBeTruthy();
    expect(year2022?.isFocused).toBeFalsy();
  });

  it('should select given year via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new YearPicker(d);
    picker.selected = new Date('2020-02-02');
    const items = picker.items!;
    const year2020 = items.find(y => y.date.getUTCFullYear() === 2020);
    const year2022 = items.find(y => y.date.getUTCFullYear() === 2022);
    expect(year2020?.isSelected).toBeTruthy();
    expect(year2022?.isSelected).toBeFalsy();
  });

  it('should focus given year via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new YearPicker(d);
    picker.focused = new Date('2020-02-02');
    const items = picker.items!;
    const year2020 = items.find(y => y.date.getUTCFullYear() === 2020);
    const year2022 = items.find(y => y.date.getUTCFullYear() === 2022);
    expect(year2020?.isFocused).toBeTruthy();
    expect(year2022?.isFocused).toBeFalsy();
  });

  it('should have unique IDs for all items', () => {
    const picker = new YearPicker(new Date('2022-09-08'));
    const ids: { [id: number]: true } = {};
    let isUnique = true;
    picker.items?.some(item => {
      if (ids[item.id]) isUnique = false;
      ids[item.id] = true;
    });
    expect(isUnique).toBeTruthy();
  });

  describe('startWith property', () => {

    const getFirstItemYear = (items: YearItem[]): number => {
      return items[0].date.getUTCFullYear();
    };

    const getLastItemYear = (items: YearItem[]): number => {
      return items[items.length - 1].date.getUTCFullYear();
    };

    it('should start with first year of the given decade', () => {
      const d = new Date('2006-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.startWith = 'firstOfDecade';
      // picker.startWith = 'x0'; // Equivalent
      expect(getFirstItemYear(picker.items!)).toEqual(2000);
      expect(getLastItemYear(picker.items!)).toEqual(2011);
      picker.focusItemByOffset(-10);
      expect(getFirstItemYear(picker.items!)).toEqual(1990);
      expect(getLastItemYear(picker.items!)).toEqual(2001);
    });

    it('should start with first year of the given decade', () => {
      const d = new Date('2006-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.startWith = 'lastOfPreviousDecade';
      picker.startWith = 'x9'; // Equivalent
      expect(getFirstItemYear(picker.items!)).toEqual(1999);
      expect(getLastItemYear(picker.items!)).toEqual(2010);
      picker.focusItemByOffset(10);
      expect(getFirstItemYear(picker.items!)).toEqual(2009);
      expect(getLastItemYear(picker.items!)).toEqual(2020);
    });
  });

  describe('focus management', () => {

    function expectFocusedDateToBeOnTheSameYear(picker: YearPicker, expected: Date): void {
      expectFocusedDateToEqual(picker, expected, TIME_INTERVAL.YEAR);
    }

    it('should move focus to the previous year', () => {
      const d = new Date('2023-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusPreviousItem();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2022-02-20'));
    });

    it('should move focus to the next year', () => {
      const d = new Date('2022-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusNextItem();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2023-02-20'));
    });

    it('should move focus to 3 years behind', () => {
      const d = new Date('2023-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusPreviousItemByOffset();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2020-02-20'));
    });

    it('should move focus to some year behind by custom offset', () => {
      const d = new Date('2023-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusOffset = 10;
      picker.focusPreviousItemByOffset();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2013-02-20'));

      // Custom one-time offset
      picker.focusPreviousItemByOffset(5);
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2008-02-20'));
    });

    it('should move focus to 3 years ahead', () => {
      const d = new Date('2019-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusNextItemByOffset();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2022-02-20'));
    });

    it('should move focus to some year ahead by custom offset', () => {
      const d = new Date('2010-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusOffset = 10;
      picker.focusNextItemByOffset();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2020-02-20'));

      // Custom one-time offset
      picker.focusNextItemByOffset(2);
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2022-02-20'));
    });

    it('should move focus to first year of the page', () => {
      const d = new Date('2006-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusFirstItemOfPage();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2000-01-01'));
    });

    it('should move focus to last year of the page', () => {
      const d = new Date('2006-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusLastItemOfPage();
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2011-02-03'));
    });

    it('should move focus by an arbitray number of years', () => {
      const d = new Date('2006-02-20');
      const picker = new YearPicker(d, { focused: d });
      picker.focusItemByOffset(-3); // Doesn't affect focusOffset property
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2003-02-20'));
      picker.focusItemByOffset(10); // Doesn't affect focusOffset property
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2013-02-20'));
      picker.focusNextItemByOffset(); // Uses pristine focusOffset property
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2016-02-20'));
    });

    it('should move focus to an arbitrary index on the page', () => {
      const d = new Date('2006-02-20');
      const picker = new YearPicker(d, { focused: d });

      picker.focusItemByIndex(2);
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2002-02-20'));

      picker.focusItemByIndex(8);
      expectFocusedDateToBeOnTheSameYear(picker, new Date('2008-02-20'));

      expect(() => picker.focusItemByIndex(-4)).toThrowError();
      expect(() => picker.focusItemByIndex(undefined)).toThrowError();
      expect(() => picker.focusItemByIndex(picker.items?.length)).toThrowError();
    });
  });
});
