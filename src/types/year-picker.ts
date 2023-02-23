import { ObjectValues } from './object-values';

export const YEAR_PICKER_START_WITH = {
  FIRST_OF_DECADE: 'firstOfDecade',
  LAST_OF_PREVIOUS_DECADE: 'lastOfPreviousDecade',
  X0: 'x0', // Equivalent to 'firstOfDecade'
  X9: 'x9', // Equivalent to 'lastOfPreviousDecade'
} as const;

export type YearPickerStartWith = ObjectValues<typeof YEAR_PICKER_START_WITH>;
