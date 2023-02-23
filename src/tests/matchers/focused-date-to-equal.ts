import { DatePicker } from '.../../pickers/date-picker/date-picker';
import { MonthPicker } from '../../pickers/month-picker/month-picker';
import { YearPicker } from '../../pickers/year-picker/year-picker';
import { TimeInterval } from '../../types';
import { expectDatesToBeOnTheSameTimeInterval } from './date-to-equal-within-interval';

export function expectFocusedDateToEqual(
  picker: DatePicker | MonthPicker | YearPicker,
  expected: Date,
  interval: TimeInterval
): void {
  expect(picker.focused).not.toBeUndefined();
  expectDatesToBeOnTheSameTimeInterval(picker.focused!, expected, interval);
  const focusedItems = (picker.items ?? []).filter(item => item.isFocused);
  expect(focusedItems.length).toEqual(1);
  expectDatesToBeOnTheSameTimeInterval(
    focusedItems[0].date,
    expected,
    interval
  );
}
