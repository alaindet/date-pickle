export type BaseItem = {
  id: number; // Has to be unique
  label: string; // Can be shown on th UI
  date: Date;
  isNow: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
}

export type DayItem = BaseItem & {
  isWeekend: boolean;
}

export type MonthItem = BaseItem;

export type YearItem = BaseItem;

export type AnyPickerItem = (
  | DayItem
  | MonthItem
  | YearItem
);
