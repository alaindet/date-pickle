import { padStart } from './pad-start';
import { TimeInterval, TIME_INTERVAL } from './../types';

const y = (d: Date) => String(d.getUTCFullYear());
const m = (d: Date) => padStart(d.getUTCMonth() + 1, '0', 2);
const d = (d: Date) => padStart(d.getUTCDate(), '0', 2);

export function comparableDate(
  date: Date | undefined | null,
  interval: TimeInterval
): number | null {
  if (!date) {
    return null;
  }

  switch (interval) {
    case TIME_INTERVAL.DAY:
      return getUniqueDayId(date);
    case TIME_INTERVAL.MONTH:
      return getUniqueMonthId(date);
    case TIME_INTERVAL.YEAR:
      return getUniqueYearId(date);
    default:
      throw new Error('invalid time interval ' + interval);
  }
}

export function cloneDate(d: Date): Date {
  return new Date(d.getTime());
}

export function addTimeInterval(
  date: Date,
  amount: number,
  precision: TimeInterval
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
