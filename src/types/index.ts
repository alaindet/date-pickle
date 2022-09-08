export type DatePickleEventHandler<T = unknown> = (data: T) => void;

export interface DatePickleItem {
  id: number; // Has to be unique
  label: string; // Can be shown on th UI
  date: Date;
  isNow: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
}

export interface DayItem extends DatePickleItem {
  isWeekend: boolean;
}

export type MonthItem = DatePickleItem;

export type YearItem = DatePickleItem;

export type Locale = string; // TODO: Better typing?

export interface PickerOptions {
  ref?: Date;
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  sync?: boolean | null;
}

export enum DatePickleView {
  YearPicker = 'year-picker',
  MonthPicker = 'month-picker',
  DatePicker = 'date-picker',
}

export interface DatePickleViewChangeEvent {
  from: DatePickleView | null;
  to: DatePickleView;
}
