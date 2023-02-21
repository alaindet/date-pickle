import { Locale } from './localization';

export type PickerOptions = {
  ref?: Date;
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  focusOffset?: number;
  sync?: boolean | null;
};
