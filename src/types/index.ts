export type ItemsChangeHandler<T = any> = (items: T[]) => void;

export interface DayItem {
  date: Date;
  isWeekend: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
}

export interface MonthItem {
  number: number;
  name: string;
  isCurrent: boolean;
  isDisabled: boolean;
}

export interface YearItem {
  year: number;
  isCurrent: boolean;
  isDisabled: boolean;
}

export type Locale = string; // TODO: Better typing?
