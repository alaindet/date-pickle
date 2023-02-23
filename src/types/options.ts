import { Locale } from './localization';
import { TimeInterval } from './time-interval';

export type PickerOptions = {
  cursor?: Date;
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  focusOffset?: number;
};

export type PickerProperties = {
  min?: Date;
  max?: Date;
  locale: Locale;
  selected?: Date;
  focused?: Date;
  focusOffset: number;
  interval: TimeInterval;
};
