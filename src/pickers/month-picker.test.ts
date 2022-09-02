import { MonthItem } from '../types';
import { MonthPicker } from './month-picker';

describe('MonthPicker', () => {

  it('should return the 12 months of any year', () => {
    const picker = new MonthPicker();
    const items = picker.getItems();
    const result = items.map(i => i.number);
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(result).toEqual(expected);
  });

  it('should mark this month as current month', () => {
    const now = new Date();
    const picker = new MonthPicker();
    const items = picker.getItems();
    const thisMonth = now.getMonth() + 1;
    const index = items.findIndex(i => i.number === thisMonth);
    expect(items[index].isCurrent).toBeTruthy();
  });

  it('should translate month names for english locale', () => {
    const picker = new MonthPicker('en');
    const items = picker.getItems();
    expect(items[0].name).toEqual('january');
  });

  it('should translate month names for italian locale', () => {
    const picker = new MonthPicker('it');
    const items = picker.getItems();
    expect(items[7].name).toEqual('agosto');
  });

  it('should disable items lower than min', () => {
    const shouldUpdate = false;
    const picker = new MonthPicker('en', shouldUpdate);
    const min = new Date();
    min.setMonth(7); // august
    picker.setMin(min);
    const items = picker.getItems();
    const july = items[6];
    const august = items[7];
    expect(july.isDisabled).toBeTruthy();
    expect(august.isDisabled).toBeFalsy();
  });

  it('should disable items greater than max', () => {
    const shouldUpdate = false;
    const picker = new MonthPicker('en', shouldUpdate);
    const max = new Date();
    max.setMonth(3); // april
    picker.setMax(max);
    const items = picker.getItems();
    const april = items[3];
    const may = items[4];
    expect(april.isDisabled).toBeFalsy();
    expect(may.isDisabled).toBeTruthy();
  });

  it('should trigger itemsChange event', async () => {
    const shouldUpdate = false;
    const picker = new MonthPicker('en', shouldUpdate);
    const items = await new Promise<MonthItem[]>((resolve, _) => {
      picker.onItemsChange(items => resolve(items));
      picker.updateItems();
    });
    expect(items.length).not.toEqual(0);
  });
});

export {};
