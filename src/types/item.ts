export interface DateRange {
  from: Date;
  to: Date;
}

export interface DatePickleItem {
  id: number; // Has to be unique
  label: string; // Can be shown on th UI
  date: Date;
  isNow: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
  inRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}

export interface DayItem extends DatePickleItem {
  isWeekend: boolean;
}

export type MonthItem = DatePickleItem;

export type YearItem = DatePickleItem;
