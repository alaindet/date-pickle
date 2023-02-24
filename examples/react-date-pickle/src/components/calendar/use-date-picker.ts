import { DatePicker, DayItem, PickerOptions } from 'date-pickle';
import { useRef, useState } from 'react';

export type DatePickerHook = {
  datePicker: DatePicker;
  items: DayItem[];
  weekdays: string[];
  title: string;
};

function getDatePickerTitle(
  items: DayItem[],
  locale = 'default',
): string {
  const d = items[15].date;
  const year = d.getFullYear();
  let month = d.toLocaleString(locale, { month: 'long' }).toLocaleLowerCase();
  month = month[0].toLocaleUpperCase() + month.slice(1);
  return `${month} ${year}`;
}

function getWeekdays(
  items: DayItem[],
  locale = 'default',
): string[] {
  return items.slice(0, 7).map(d => {
    return d.date.toLocaleString(locale, { weekday: 'short' }).slice(0, 2);
  });
}

export function useDatePicker(options?: PickerOptions): DatePickerHook {

  // TODO: Use useReducer()?
  const [title, setTitle] = useState('');
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [items, setItems] = useState<DayItem[]>([]);
  const dp = useRef<DatePicker | null>(null);

  if (!dp.current) {
    dp.current = new DatePicker(options);
    dp.current.onItemsChange(items => {
      setTitle(getDatePickerTitle(items));
      setWeekdays(getWeekdays(items));
      setItems(items);
    }, true);
  }

  return {
    datePicker: dp.current!,
    items,
    weekdays,
    title,
  };
}
