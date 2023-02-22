import { padStart } from './pad-start';
import { TimeInterval, TIME_INTERVAL } from './../types';

type DateSegmentParser = (d: Date) => string;
type Comparator = (d: Date) => number;

const y = (d: Date) => String(d.getUTCFullYear());
const m = (d: Date) => padStart(d.getUTCMonth() + 1, '0', 2);
const d = (d: Date) => padStart(d.getUTCDate(), '0', 2);
const createComparator = (...parsers: DateSegmentParser[]): Comparator => {
  return (date: Date) => Number(parsers.map(p => p(date)).join(''));
};

export function comparableDate(
  date: Date | undefined | null,
  precision: TimeInterval,
): number | null {

  if (!date) {
    return null;
  }

  switch (precision) {

    case TIME_INTERVAL.DAY:
      return createComparator(y, m, d)(date);

    case TIME_INTERVAL.MONTH:
      return createComparator(y, m)(date);

    case TIME_INTERVAL.YEAR:
      return createComparator(y)(date);

    default:
      throw new Error('invalid time interval ' + precision);
  }
}

export function cloneDate(d: Date): Date {
  return new Date(d.getTime());
}

export function addTimeInterval(
  date: Date,
  amount: number,
  precision: TimeInterval,
): Date {

  const d = cloneDate(date);

  switch (precision) {

    case TIME_INTERVAL.DAY:
      d.setUTCDate(d.getUTCDate() + amount);
      break;

    // There are known edge cases for leap years
    case TIME_INTERVAL.MONTH:
      d.setUTCMonth(d.getUTCMonth() + amount);
      break;

    // There are known edge cases for leap years
    case TIME_INTERVAL.YEAR:
      d.setUTCFullYear(d.getUTCFullYear() + amount);
      break;
  }

  return d;
}

// Ex: 2012 => 20129999
export function getUniqueYearId(date: Date): number {
  return Number(`${y(date)}9999`);
}

// Ex.: 2012-03 => 20120399
export function getUniqueMonthId(date: Date): number {
  return Number(`${y(date)}${m(date)}99`);
}

// Ex.: 2012-03-09 => 20120309
export function getUniqueDayId(date: Date): number {
  return Number(`${y(date)}${m(date)}${d(date)}`);
}
