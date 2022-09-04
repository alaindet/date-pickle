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

  it('should mark today as current date', () => {
    const now = new Date();
    const picker = new DatePicker(now);
    const todayIndex = now.getUTCDate() - 1;

    // Discard days from adjacent months
    const items = picker.items!.filter(d => {
      return d.date.getUTCMonth() === now.getUTCMonth();
    });

    expect(items![todayIndex].isCurrent).toBeTruthy();
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
    const shouldUpdate = false;
    const picker = new DatePicker(cloneDate(d), shouldUpdate);
    const MIN_DATE = 5; // 5th of this month
    d.setDate(MIN_DATE);
    picker.min = cloneDate(d);
    picker.shouldUpdate = true;
    const items = picker.items!;
    const index = items.findIndex(i => i.date.getDate() === MIN_DATE);
    expect(items[index - 1].isDisabled).toBeTruthy(); // below min
    expect(items[index].isDisabled).toBeFalsy(); // equal to min
    expect(items[index + 1].isDisabled).toBeFalsy(); // above min
  });

  it('should disable items greater than max', () => {
    const d = new Date();
    const shouldUpdate = false;
    const picker = new DatePicker(cloneDate(d), shouldUpdate);
    const MAX_DATE = 6; // 6th of this month
    d.setDate(MAX_DATE);
    picker.max = cloneDate(d);
    picker.shouldUpdate = true;
    const items = picker.items!;
    const index = items.findIndex(i => i.date.getDate() === MAX_DATE);
    expect(items[index - 1].isDisabled).toBeFalsy(); // below max
    expect(items[index].isDisabled).toBeFalsy(); // equal to max
    expect(items[index + 1].isDisabled).toBeTruthy(); // above max
  });

  it('should trigger itemsChange event', async () => {
    const shouldUpdate = false;
    const picker = new DatePicker(new Date(), shouldUpdate);
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
});

export {};
