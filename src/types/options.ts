import { DateRange } from './item';
import { Locale } from './localization';

export interface PickerOptions {
  ref?: Date;
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  sync?: boolean | null;
  range?: Partial<DateRange>;
}
