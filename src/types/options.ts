import { Locale } from './localization';

export type PickerOptions = {
  cursor?: Date;
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  focusOffset?: number;

  // Date Picker-specific
  weekdaysLength?: number;
};
