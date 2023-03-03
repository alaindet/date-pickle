import { cloneDate, comparableDate, didPageChange } from '../../utils';
import { DayItem, TIME_INTERVAL } from '../../types';
import { DatePicker } from './date-picker';
import { expectFocusedDateToEqual } from '../../tests/matchers';

function comparable(d: Date) {
  return comparableDate(d, 'day');
}

function expectFocusedDateToBeOnTheSameDay(
  picker: DatePicker,
  expected: Date
): void {
  expectFocusedDateToEqual(picker, expected, TIME_INTERVAL.DAY);
}

describe('DatePicker', () => {
  it('should display 31 days for august', () => {
    const AUGUST = 7; // Month index
    const d = new Date(Date.UTC(2022, AUGUST, 15));
    const picker = new DatePicker(d);

    // Discard days from adjacent months
    const items = picker.items.filter(d => {
      return d.date.getUTCMonth() === AUGUST;
    });

    expect(items.length).toEqual(31);
  });

  it('should mark today with isNow = true flag', () => {
    const now = new Date();
    const picker = new DatePicker(now);
    const todayIndex = now.getUTCDate() - 1;

    // Discard days from adjacent months
    const items = picker.items.filter(d => {
      return d.date.getUTCMonth() === now.getUTCMonth();
    });

    expect(items![todayIndex].isNow).toBeTruthy();
  });

  it('should show saturdays and sundays as weekend days', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const items = picker.items;

    const testCases: { input: number; expected: boolean }[] = [
      { input: 18, expected: false }, // friday
      { input: 19, expected: true }, // saturday
      { input: 20, expected: true }, // sunday
      { input: 21, expected: false }, // monday
    ];

    testCases.forEach(({ input, expected }) => {
      expect(items[input].isWeekend).toEqual(expected);
    });
  });

  it('should disable items lower than min', () => {
    const d = new Date();
    const MIN_DATE = 5; // 5th of this month
    const min = cloneDate(d);
    min.setUTCDate(MIN_DATE);
    const picker = new DatePicker(d, { min });
    const items = picker.items;
    const index = items.findIndex(i => i.date.getDate() === MIN_DATE);
    expect(items[index - 1].isDisabled).toBeTruthy(); // below min
    expect(items[index].isDisabled).toBeFalsy(); // equal to min
    expect(items[index + 1].isDisabled).toBeFalsy(); // above min
  });

  it('should disable items greater than max', () => {
    const d = new Date();
    const max = cloneDate(d);
    const MAX_DATE = 6; // 6th of this month
    max.setUTCDate(MAX_DATE);
    const picker = new DatePicker(d, { max });
    const items = picker.items;
    const index = items.findIndex(i => i.date.getDate() === MAX_DATE);
    expect(items[index - 1].isDisabled).toBeFalsy(); // below max
    expect(items[index].isDisabled).toBeFalsy(); // equal to max
    expect(items[index + 1].isDisabled).toBeTruthy(); // above max
  });

  it('should trigger onItemsChange', () => {
    const picker = new DatePicker();
    let result!: DayItem[];
    picker.onItemsChange(items => (result = items), true);
    expect(result.length).not.toEqual(0);
  });

  it('should trigger onTitleChange', () => {
    const picker = new DatePicker(new Date('2023-03-03'), { locale: 'en' });
    let result!: string;
    picker.onTitleChange(title => (result = title), true);
    expect(result).toEqual('March 2023');
  });

  it('should trigger onWeekdaysChange', () => {
    const options = { locale: 'en', weekdaysLength: 2 };
    const picker = new DatePicker(new Date('2023-03-03'), options);
    let result!: string[];
    picker.onWeekdaysChange(weekdays => (result = weekdays), true);
    expect(result).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
  });

  it('should trigger onSelectedChange', () => {
    const d = new Date('2022-09-05');
    const picker = new DatePicker({ selected: d });
    let result!: Date | undefined;
    picker.onSelectedChange(selected => (result = selected), true);
    expect(result).toBeTruthy();
    expect(comparable(result!)).toEqual(comparable(d));
  });

  it('should trigger onFocusedChange', () => {
    const d = new Date('2022-09-05');
    const picker = new DatePicker({ focused: d });
    let result!: Date | undefined;
    picker.onFocusedChange(focused => (result = focused), true);
    expect(result).toBeTruthy();
    expect(comparable(result!)).toEqual(comparable(d));
  });

  // eslint-disable-next-line quotes
  it("should show next month's dates when calling next()", () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const month1 = picker.items[10].date.getMonth();
    picker.next();
    const month2 = picker.items[10].date.getMonth();
    expect(month2).toEqual(month1 + 1);
  });

  // eslint-disable-next-line quotes
  it("should show previous month's dates when calling prev()", () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const month1 = picker.items[10].date.getMonth();
    picker.prev();
    const month2 = picker.items[10].date.getMonth();
    expect(month2).toEqual(month1 - 1);
  });

  it('should reset to now', () => {
    const now = new Date();
    const todayComparable = comparable(now);
    const old = new Date('2020-03-04');
    const picker = new DatePicker(old);
    const oldItems = picker.items.map(i => comparable(i.date));
    expect(oldItems).not.toContainEqual(todayComparable);
    picker.now();
    const items = picker.items.map(i => comparable(i.date));
    expect(items).toContainEqual(todayComparable);
  });

  it('should select given date via options', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comparable(d);
    const selected = new Date('2022-08-15.');
    const selectedComp = comparable(selected);
    const picker = new DatePicker(d, { selected });
    const items = picker.items;
    const shouldBeSelected = items.find(
      i => comparable(i.date) === selectedComp
    );
    const shouldNoBeSelected = items.find(
      i => comparable(i.date) === dummyComp
    );
    expect(shouldBeSelected?.isSelected).toBeTruthy();
    expect(shouldNoBeSelected?.isSelected).toBeFalsy();
  });

  it('should select given date via setter', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comparable(d);
    const selected = new Date('2022-08-15.');
    const selectedComp = comparable(selected);
    const picker = new DatePicker(d);
    picker.selected = selected;
    const items = picker.items;
    const shouldBeSelected = items.find(
      i => comparable(i.date) === selectedComp
    );
    const shouldNoBeSelected = items.find(
      i => comparable(i.date) === dummyComp
    );
    expect(shouldBeSelected?.isSelected).toBeTruthy();
    expect(shouldNoBeSelected?.isSelected).toBeFalsy();
  });

  it('should focus given date via options', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comparable(d);
    const focused = new Date('2022-08-15.');
    const focusedComp = comparable(focused);
    const picker = new DatePicker(d, { focused });
    const items = picker.items;
    const shouldBeFocused = items.find(i => comparable(i.date) === focusedComp);
    const shouldNoBeFocused = items.find(i => comparable(i.date) === dummyComp);
    expect(shouldBeFocused?.isFocused).toBeTruthy();
    expect(shouldNoBeFocused?.isFocused).toBeFalsy();
  });

  it('should focus given date via setter', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comparable(d);
    const focused = new Date('2022-08-15.');
    const focusedComp = comparable(focused);
    const picker = new DatePicker(d);
    picker.focused = focused;
    const items = picker.items;
    const shouldBeFocused = items.find(i => comparable(i.date) === focusedComp);
    const shouldNoBeFocused = items.find(i => comparable(i.date) === dummyComp);
    expect(shouldBeFocused?.isFocused).toBeTruthy();
    expect(shouldNoBeFocused?.isFocused).toBeFalsy();
  });

  it('should treat null values on optional properties as undefined', () => {
    const picker = new DatePicker(new Date('2022-09-05'), {
      min: new Date('2019-09-05'),
      max: new Date('2022-09-06'),
      selected: new Date('2022-09-03'),
      focused: new Date('2022-09-04'),
    });

    picker.updateAfter(() => {
      picker.min = null; // Same as picker.min = undefined;
      picker.max = null; // Same as picker.max = undefined;
      picker.selected = null; // Same as picker.selected = undefined;
      picker.focused = null; // Same as picker.focused = undefined;
    });

    expect(picker.min).toBeUndefined();
    expect(picker.max).toBeUndefined();
    expect(picker.selected).toBeUndefined();
    expect(picker.focused).toBeUndefined();
  });

  it('should disable adjacent months days disabled', () => {
    const picker = new DatePicker(new Date('2022-09-05'), {
      min: new Date('2022-08-31'),
      max: new Date('2022-10-02'),
    });

    const items = picker.items;
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    expect(firstItem.isDisabled).toBeTruthy();
    expect(lastItem.isDisabled).toBeTruthy();
  });

  it('should have unique IDs for all items', () => {
    const picker = new DatePicker(new Date('2022-09-08'));
    const ids: { [id: number]: true } = {};
    let isUnique = true;
    picker.items?.some(item => {
      if (ids[item.id]) isUnique = false;
      ids[item.id] = true;
    });
    expect(isUnique).toBeTruthy();
  });

  describe('focus management', () => {
    it('should move focus to previous day', () => {
      const d = new Date('2023-02-20');
      const picker = new DatePicker(d, { focused: d });
      picker.focusPreviousItem();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-02-19'));

      picker.focused = new Date('2023-01-01');
      const pageChanged = didPageChange(picker, () =>
        picker.focusPreviousItem()
      );
      expect(pageChanged).toBeTruthy();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2022-12-31'));
    });

    it('should move focus to the next day', () => {
      const d = new Date('2023-02-20');
      const picker = new DatePicker(d, { focused: d });
      picker.focusNextItem();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-02-21'));

      picker.focused = new Date('2022-02-28');
      const pageChanged = didPageChange(picker, () => picker.focusNextItem());
      expect(pageChanged).toBeTruthy();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2022-03-01'));
    });

    it('should move focus to a week earlier', () => {
      const d1 = new Date('2023-02-20');
      const picker = new DatePicker(d1, { focused: d1 });
      picker.focusPreviousItemByOffset();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-02-13'));

      picker.focused = new Date('2023-02-02');
      const pageChanged = didPageChange(picker, () =>
        picker.focusPreviousItemByOffset()
      );
      expect(pageChanged).toBeTruthy();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-01-26'));
    });

    it('should move focus to a day behind by custom offset', () => {
      const d = new Date('2023-02-20');
      const picker = new DatePicker(d, { focused: d });
      picker.focusPreviousItemByOffset(3);
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-02-17'));

      picker.focused = new Date('2023-02-05');
      const pageChanged = didPageChange(picker, () =>
        picker.focusPreviousItemByOffset(14)
      );
      expect(pageChanged).toBeTruthy();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-01-22'));
    });

    it('should move focus to a week ahead', () => {
      const d = new Date('2019-02-20');
      const picker = new DatePicker(d, { focused: d });
      picker.focusNextItemByOffset();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2019-02-27'));

      picker.focused = new Date('2021-02-27');
      const pageChanged = didPageChange(picker, () =>
        picker.focusNextItemByOffset()
      );
      expect(pageChanged).toBeTruthy();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2021-03-06'));
    });

    it('should move focus to a day ahead by custom offset', () => {
      const d = new Date('2010-06-06');
      const picker = new DatePicker(d, { focused: d });
      picker.focusNextItemByOffset(9);
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2010-06-15'));

      picker.focused = new Date('2023-02-20');
      const pageChanged = didPageChange(picker, () =>
        picker.focusNextItemByOffset(14)
      );
      expect(pageChanged).toBeTruthy();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-03-06'));
    });

    it('should move focus to first day of the page', () => {
      const d = new Date('2023-08-15');
      const picker = new DatePicker(d, { focused: d });
      picker.focusFirstItemOfPage();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-08-01'));
    });

    it('should move focus to last month of the page', () => {
      const d = new Date('2023-08-15');
      const picker = new DatePicker(d, { focused: d });
      picker.focusLastItemOfPage();
      expectFocusedDateToBeOnTheSameDay(picker, new Date('2023-08-31'));
    });
  });
});
