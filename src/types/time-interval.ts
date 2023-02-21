import { ObjectValues } from './object-values';

export const TIME_INTERVAL = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type TimeInterval = ObjectValues<typeof TIME_INTERVAL>;
