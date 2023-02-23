import { expectFocusedDateToEqual } from '../../tests/matchers';
import { MonthItem, TIME_INTERVAL } from '../../types';
import { cloneDate, comparableDate } from '../../utils';
import { MonthPicker } from './month-picker';

const comparable = (d: Date) => comparableDate(d, 'month');

describe('MonthPicker', () => {
  it('should return the 12 months of any year', () => {
    const picker = new MonthPicker();
    const result = picker.items.map(i => i.date.getUTCMonth()).join(', ');
    const expected = '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11';
    expect(result).toEqual(expected);
  });

  // Failed
  it('should mark this month with isNow = true', () => {
    const now = new Date();
    const picker = new MonthPicker(now);
    const items = picker.items;
    const thisMonth = now.getUTCMonth();
    const index = items.findIndex(i => i.date.getUTCMonth() === thisMonth);
    expect(items[index].isNow).toBeTruthy();
  });

  it('should translate month names for english locale', () => {
    const picker = new MonthPicker(new Date(), { locale: 'en' });
    expect(picker.items[0].label).toEqual('january');
  });

  it('should translate month names for italian locale', () => {
    const picker = new MonthPicker(new Date(), { locale: 'it' });
    expect(picker.items[7].label).toEqual('agosto');
  });

  // Failed
  it('should disable items lower than min', () => {
    const now = new Date();
    const min = cloneDate(now);
    min.setUTCMonth(7); // august
    const picker = new MonthPicker(new Date(), { locale: 'en', min });
    const items = picker.items;
    const july = items[6];
    const august = items[7];
    expect(july.isDisabled).toBeTruthy();
    expect(august.isDisabled).toBeFalsy();
  });

  // Failed
  it('should disable items greater than max', () => {
    const now = new Date();
    const max = cloneDate(now);
    max.setUTCMonth(3); // april
    const picker = new MonthPicker(now, { locale: 'en', max });
    const items = picker.items;
    const april = items[3];
    const may = items[4];
    expect(april.isDisabled).toBeFalsy();
    expect(may.isDisabled).toBeTruthy();
  });

  it('should trigger onItemsChange', async () => {
    const picker = new MonthPicker();
    const items = await new Promise<MonthItem[]>(done => {
      const immediate = true;
      picker.onItemsChange(items => done(items), immediate);
    });
    expect(items.length).not.toEqual(0);
  });

  it('should trigger onSelectedChange', () => {
    const d = new Date('2022-09-05');
    const picker = new MonthPicker({ selected: d });
    let result!: Date | undefined;
    picker.onSelectedChange(selected => (result = selected), true);
    expect(result).toBeTruthy();
    expect(comparable(result!)).toEqual(comparable(d));
  });

  it('should trigger onFocusedChange', async () => {
    const d = new Date('2022-09-05');
    const picker = new MonthPicker({ focused: d });
    let result!: Date | undefined;
    picker.onFocusedChange(focused => (result = focused), true);
    expect(result).toBeTruthy();
    expect(comparable(result!)).toEqual(comparable(d));
  });

  it('should show next year when calling next()', () => {
    const picker = new MonthPicker(new Date('2000-01-01'));
    picker.next();
    const year = picker.cursor.getUTCFullYear();
    expect(year).toEqual(2001);
  });

  it('should show previous year when calling prev()', () => {
    const picker = new MonthPicker(new Date('2000-01-01'));
    picker.prev();
    const year = picker.cursor.getUTCFullYear();
    expect(year).toEqual(1999);
  });

  it('should select given month via options', () => {
    const d = new Date('2022-02-02');
    const selected = new Date('2022-03-03');
    const picker = new MonthPicker(d, { selected });
    const items = picker.items;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isSelected).toBeTruthy();
    expect(februrary2022?.isSelected).toBeFalsy();
  });

  it('should select given month via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new MonthPicker(d);
    picker.selected = new Date('2022-03-03');
    const items = picker.items;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isSelected).toBeTruthy();
    expect(februrary2022?.isSelected).toBeFalsy();
  });

  it('should focus given month via options', () => {
    const d = new Date('2022-02-02');
    const focused = new Date('2022-03-03');
    const picker = new MonthPicker(d, { focused });
    const items = picker.items;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isFocused).toBeTruthy();
    expect(februrary2022?.isFocused).toBeFalsy();
  });

  it('should focus given month via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new MonthPicker(d);
    picker.focused = new Date('2022-03-03');
    const items = picker.items;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isFocused).toBeTruthy();
    expect(februrary2022?.isFocused).toBeFalsy();
  });

  it('should have unique IDs for all items', () => {
    const picker = new MonthPicker(new Date('2022-09-08'));
    const ids: { [id: number]: true } = {};
    let isUnique = true;
    picker.items?.some(item => {
      if (ids[item.id]) isUnique = false;
      ids[item.id] = true;
    });
    expect(isUnique).toBeTruthy();
  });

  describe('focus management', () => {
    function expectFocusedDateToBeOnTheSameMonth(
      picker: MonthPicker,
      expected: Date
    ): void {
      expectFocusedDateToEqual(picker, expected, TIME_INTERVAL.MONTH);
    }

    it('should move focus to previous month', () => {
      const d = new Date('2023-02-20');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusPreviousItem();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2023-01-06'));
    });

    it('should move focus to the next month', () => {
      const d = new Date('2012-03-09');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusNextItem();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2012-04-09'));
    });

    it('should move focus to 3 months behind', () => {
      const d = new Date('2023-02-20');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusPreviousItemByOffset();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2022-11-20'));
    });

    it('should move focus to a month behind by custom offset', () => {
      const d = new Date('2023-02-20');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusOffset = 9;
      picker.focusPreviousItemByOffset();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2022-05-29'));

      // Custom one-time offset
      picker.focusPreviousItemByOffset(2);
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2022-03-27'));
    });

    it('should move focus to 3 months ahead', () => {
      const d = new Date('2019-02-20');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusNextItemByOffset();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2019-05-17'));
    });

    it('should move focus to a month ahead by custom offset', () => {
      const d = new Date('2010-06-06');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusOffset = 9;
      picker.focusNextItemByOffset();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2011-03-07'));

      // Custom one-time offset
      picker.focusNextItemByOffset(2);
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2011-05-29'));
    });

    it('should move focus to first month of the page', () => {
      const d = new Date('2006-09-09');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusFirstItemOfPage();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2006-01-31'));
    });

    it('should move focus to last month of the page', () => {
      const d = new Date('2006-08-18');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusLastItemOfPage();
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2006-12-25'));
    });

    it('should move focus by an arbitray number of years', () => {
      const d = new Date('2006-02-20');
      const picker = new MonthPicker(d, { focused: d });
      picker.focusItemByOffset(-3); // Doesn't affect focusOffset property
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2005-11-20'));
      picker.focusItemByOffset(10); // Doesn't affect focusOffset property
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2006-09-20'));
      picker.focusNextItemByOffset(); // Uses pristine focusOffset property
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2006-12-20'));
    });

    it('should move focus to an arbitrary index on the page', () => {
      const d = new Date('2006-02-20');
      const picker = new MonthPicker(d, { focused: d });

      picker.focusItemByIndex(2);
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2006-03-09'));

      picker.focusItemByIndex(6);
      expectFocusedDateToBeOnTheSameMonth(picker, new Date('2006-07-20'));

      expect(() => picker.focusItemByIndex(-4)).toThrowError();
      expect(() => picker.focusItemByIndex(undefined)).toThrowError();
      expect(() =>
        picker.focusItemByIndex(picker.items?.length)
      ).toThrowError();
    });
  });
});
