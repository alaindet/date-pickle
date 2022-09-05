export type ItemsChangeHandler<T = unknown> = (items: T[]) => void;

export type EventHandler<T = unknown> = (data: T) => void;

export interface DatePickleItem {
  isNow: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
}

export interface DayItem extends DatePickleItem {
  date: Date;
  isWeekend: boolean;
}

export interface MonthItem extends DatePickleItem {
  number: number;
  name: string;
}

export interface YearItem extends DatePickleItem {
  year: number;
}

export type Locale = string; // TODO: Better typing?

export interface PickerOptions {
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  shouldUpdate?: boolean | null;
}
