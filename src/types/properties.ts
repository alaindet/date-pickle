import { Locale } from './localization';
import { TimeInterval } from './time-interval';

export type PickerProperties = {
  min?: Date;
  max?: Date;
  locale: Locale;
  selected?: Date;
  focused?: Date;
  focusOffset: number;
  interval: TimeInterval;

  // Date Picker-specific
  weekdaysLength: number;
};
