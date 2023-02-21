import { padStart } from './pad-start';
import { TimeInterval, TIME_INTERVAL } from './../types';

const y = (d: Date) => String(d.getUTCFullYear());
const m = (d: Date) => padStart(d.getUTCMonth() + 1, '0', 2);
const d = (d: Date) => padStart(d.getUTCDate(), '0', 2);

export function comparableDate(
  date: Date,
  precision: TimeInterval,
): number {
  const toComparable = (...fns: ((d: Date) => string)[]): number => {
    return +fns.map(fn => fn(date)).join('');
  };

  switch (precision) {

    case TIME_INTERVAL.DAY:
      return toComparable(y, m, d);

    case TIME_INTERVAL.MONTH:
      return toComparable(y, m);

    case TIME_INTERVAL.YEAR:
      return toComparable(y);
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
