import { cloneDate, comparableDate } from '../utils';
import { DayItem } from '../types';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {

  it('should display 31 days for august', () => {
    const AUGUST = 7; // Month index
    const d = new Date(Date.UTC(2022, AUGUST, 15));
    const picker = new DatePicker(d);

    // Discard days from adjacent months
    const items = picker.items!.filter(d => {
      return d.date.getUTCMonth() === AUGUST;
    });

    expect(items.length).toEqual(31);
  });

  it('should mark today with isNow = true flag', () => {
    const now = new Date();
    const picker = new DatePicker(now);
    const todayIndex = now.getUTCDate() - 1;

    // Discard days from adjacent months
    const items = picker.items!.filter(d => {
      return d.date.getUTCMonth() === now.getUTCMonth();
    });

    expect(items![todayIndex].isNow).toBeTruthy();
  });

  it('should show saturdays and sundays as weekend days', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const items = picker.items!;

    const testCases: { input: number; expected: boolean; }[] = [
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
    const items = picker.items!;
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
    const items = picker.items!;
    const index = items.findIndex(i => i.date.getDate() === MAX_DATE);
    expect(items[index - 1].isDisabled).toBeFalsy(); // below max
    expect(items[index].isDisabled).toBeFalsy(); // equal to max
    expect(items[index + 1].isDisabled).toBeTruthy(); // above max
  });

  it('should trigger itemsChange event', async () => {
    const picker = new DatePicker(new Date(), { shouldUpdate: false });
    const items = await new Promise<DayItem[]>((resolve, _) => {
      picker.onItemsChange(items => resolve(items));
      picker.shouldUpdate = true;
    });
    expect(items.length).not.toEqual(0);
  });

  it('should show next month\'s dates when calling next()', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const month1 = picker.items![10].date.getMonth();
    picker.next();
    const month2 = picker.items![10].date.getMonth();
    expect(month2).toEqual(month1 + 1);
  });

  it('should show previous month\'s dates when calling prev()', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const month1 = picker.items![10].date.getMonth();
    picker.prev();
    const month2 = picker.items![10].date.getMonth();
    expect(month2).toEqual(month1 - 1);
  });

  it('should reset to now', () => {
    const now = new Date();
    const todayComparable = comparableDate(now, 'day');
    const old = new Date('2020-03-04');
    const picker = new DatePicker(old);
    const oldItems = picker.items!.map(i => comparableDate(i.date, 'day'));
    expect(oldItems).not.toContainEqual(todayComparable);
    picker.now();
    const items = picker.items!.map(i => comparableDate(i.date, 'day'));
    expect(items).toContainEqual(todayComparable);
  });

  const comp = (d: Date) => comparableDate(d, 'day');

  it('should select given date via options', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comp(d);
    const selected = new Date('2022-08-15.');
    const selectedComp = comp(selected);
    const picker = new DatePicker(d, { selected });
    const items = picker.items!;
    const shouldBeSelected = items.find(i => comp(i.date) === selectedComp);
    const shouldNoBeSelected = items.find(i => comp(i.date) === dummyComp);
    expect(shouldBeSelected?.isSelected).toBeTruthy();
    expect(shouldNoBeSelected?.isSelected).toBeFalsy();
  });

  it('should select given date via setter', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comp(d);
    const selected = new Date('2022-08-15.');
    const selectedComp = comp(selected);
    const picker = new DatePicker(d);
    picker.selected = selected;
    const items = picker.items!;
    const shouldBeSelected = items.find(i => comp(i.date) === selectedComp);
    const shouldNoBeSelected = items.find(i => comp(i.date) === dummyComp);
    expect(shouldBeSelected?.isSelected).toBeTruthy();
    expect(shouldNoBeSelected?.isSelected).toBeFalsy();
  });

  it('should focus given date via options', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comp(d);
    const focused = new Date('2022-08-15.');
    const focusedComp = comp(focused);
    const picker = new DatePicker(d, { focused });
    const items = picker.items!;
    const shouldBeFocused = items.find(i => comp(i.date) === focusedComp);
    const shouldNoBeFocused = items.find(i => comp(i.date) === dummyComp);
    expect(shouldBeFocused?.isFocused).toBeTruthy();
    expect(shouldNoBeFocused?.isFocused).toBeFalsy();
  });

  it('should focus given date via setter', () => {
    const d = new Date('2022-08-08');
    const dummyComp = comp(d);
    const focused = new Date('2022-08-15.');
    const focusedComp = comp(focused);
    const picker = new DatePicker(d);
    picker.focused = focused;
    const items = picker.items!;
    const shouldBeFocused = items.find(i => comp(i.date) === focusedComp);
    const shouldNoBeFocused = items.find(i => comp(i.date) === dummyComp);
    expect(shouldBeFocused?.isFocused).toBeTruthy();
    expect(shouldNoBeFocused?.isFocused).toBeFalsy();
  });
});

export {};
