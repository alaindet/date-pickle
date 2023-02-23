import { MonthPicker } from '../pickers/month-picker/month-picker';
import { YearPicker } from '../pickers/year-picker/year-picker';
import { DatePicker } from '../pickers/date-picker/date-picker';

function getPageHash(picker: DatePicker | MonthPicker | YearPicker): string {
  const items = picker.items;
  const first = items[0].id;
  const last = items[items.length - 1].id;
  return `${first}>${last}`;
}

export function didPageChange(
  picker: DatePicker | MonthPicker | YearPicker,
  fn: () => void
): boolean {
  const before = getPageHash(picker);
  fn();
  const after = getPageHash(picker);
  return before !== after;
}
