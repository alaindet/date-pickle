import { cloneDate, comparableDate } from '../utils';
import { DayItem } from '../types';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {

  it('should display 31 days for august', () => {
    const shouldUpdate = false;
    const picker = new DatePicker(new Date('2022-08-15'), shouldUpdate);
    picker.setPeek(false);
    const items = picker.getItems();
    expect(items.length).toEqual(31);
  });

  it('should mark today as current date', () => {
    const now = new Date();
    const shouldUpdate = false;
    const picker = new DatePicker(now, shouldUpdate);
    picker.setPeek(false);
    const items = picker.getItems();
    const index = now.getDate() - 1;
    expect(items[index].isCurrent).toBeTruthy();
  });

  it('should show saturdays and sundays as weekend days', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const items = picker.getItems();

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
    picker.setMin(cloneDate(d));
    const items = picker.getItems();
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
    picker.setMax(cloneDate(d));
    const items = picker.getItems();
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
      picker.updateItems();
    });
    expect(items.length).not.toEqual(0);
  });

  it('should show next month\'s dates when calling next()', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const month1 = picker.getItems()[10].date.getMonth();
    picker.next();
    const month2 = picker.getItems()[10].date.getMonth();
    expect(month2).toEqual(month1 + 1);
  });

  it('should show previous month\'s dates when calling prev()', () => {
    const picker = new DatePicker(new Date('2022-08-15'));
    const month1 = picker.getItems()[10].date.getMonth();
    picker.prev();
    const month2 = picker.getItems()[10].date.getMonth();
    expect(month2).toEqual(month1 - 1);
  });

  it('should reset to now', () => {
    const now = new Date();
    const todayComparable = comparableDate(now, 'day');
    const old = new Date('2020-03-04');
    const picker = new DatePicker(old);
    const oldItems = picker.getItems().map(i => comparableDate(i.date, 'day'));
    expect(oldItems).not.toContainEqual(todayComparable);
    picker.setNow();
    const items = picker.getItems().map(i => comparableDate(i.date, 'day'));
    expect(items).toContainEqual(todayComparable);
  });
});

export {};
