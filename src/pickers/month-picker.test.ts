import { MonthItem } from '../types';
import { cloneDate, comparableDate } from '../utils';
import { MonthPicker } from './month-picker';

const comparable = (d: Date) => comparableDate(d, 'month');

describe('MonthPicker', () => {

  it('should return the 12 months of any year', () => {
    const picker = new MonthPicker();
    const result = picker.items!.map(i => i.number);
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(result).toEqual(expected);
  });

  it('should mark this month with isNow = true', () => {
    const now = new Date();
    const picker = new MonthPicker(now);
    const items = picker.items!;
    const thisMonth = now.getMonth() + 1;
    const index = items.findIndex(i => i.number === thisMonth);
    expect(items[index].isNow).toBeTruthy();
  });

  it('should translate month names for english locale', () => {
    const picker = new MonthPicker(new Date(), { locale: 'en' });
    expect(picker.items![0].name).toEqual('january');
  });

  it('should translate month names for italian locale', () => {
    const picker = new MonthPicker(new Date(), { locale: 'it' });
    expect(picker.items![7].name).toEqual('agosto');
  });

  it('should disable items lower than min', () => {
    const now = new Date();
    const min = cloneDate(now);
    min.setUTCMonth(7); // august
    const picker = new MonthPicker(new Date(), { locale: 'en', min });
    const items = picker.items!;
    const july = items[6];
    const august = items[7];
    expect(july.isDisabled).toBeTruthy();
    expect(august.isDisabled).toBeFalsy();
  });

  it('should disable items greater than max', () => {
    const now = new Date();
    const max = cloneDate(now);
    max.setUTCMonth(3); // april
    const picker = new MonthPicker(now, { locale: 'en', max });
    const items = picker.items!;
    const april = items[3];
    const may = items[4];
    expect(april.isDisabled).toBeFalsy();
    expect(may.isDisabled).toBeTruthy();
  });

  it('should trigger onItemsChange', async () => {
    const now = new Date();
    const picker = new MonthPicker(now, { locale: 'en', shouldUpdate: false });
    const items = await new Promise<MonthItem[]>((resolve, _) => {
      picker.onItemsChange(items => resolve(items));
      picker.shouldUpdate = true;
    });
    expect(items.length).not.toEqual(0);
  });

  it('should trigger onSelected', async () => {
    const d = new Date('2022-09-05');
    const picker = new MonthPicker();
    const selected = await new Promise<Date | undefined>((resolve, _) => {
      picker.onSelected(selected => resolve(selected));
      picker.selected = d;
    });
    expect(selected).toBeTruthy();
    expect(comparable(selected!)).toEqual(comparable(d));
  });

  it('should trigger onFocused', async () => {
    const d = new Date('2022-09-05');
    const picker = new MonthPicker();
    const focused = await new Promise<Date | undefined>((resolve, _) => {
      picker.onFocused(focused => resolve(focused));
      picker.focused = d;
    });
    expect(focused).toBeTruthy();
    expect(comparable(focused!)).toEqual(comparable(d));
  });

  it('should select given month via options', () => {
    const d = new Date('2022-02-02');
    const selected = new Date('2022-03-03');
    const picker = new MonthPicker(d, { selected });
    const items = picker.items!;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isSelected).toBeTruthy();
    expect(februrary2022?.isSelected).toBeFalsy();
  });

  it('should select given month via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new MonthPicker(d);
    picker.selected = new Date('2022-03-03');
    const items = picker.items!;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isSelected).toBeTruthy();
    expect(februrary2022?.isSelected).toBeFalsy();
  });

  it('should focus given month via options', () => {
    const d = new Date('2022-02-02');
    const focused = new Date('2022-03-03');
    const picker = new MonthPicker(d, { focused });
    const items = picker.items!;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isFocused).toBeTruthy();
    expect(februrary2022?.isFocused).toBeFalsy();
  });

  it('should focus given month via setter', () => {
    const d = new Date('2022-02-02');
    const picker = new MonthPicker(d);
    picker.focused = new Date('2022-03-03');
    const items = picker.items!;
    const februrary2022 = items[1];
    const march2022 = items[2];
    expect(march2022?.isFocused).toBeTruthy();
    expect(februrary2022?.isFocused).toBeFalsy();
  });
});

export {};
