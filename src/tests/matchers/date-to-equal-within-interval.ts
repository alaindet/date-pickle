import { TimeInterval, TIME_INTERVAL } from '../../types';
import { comparableDate } from '../../utils';

export function expectDatesToBeOnTheSameTimeInterval(
  result: Date,
  expected: Date,
  interval: TimeInterval
): void {
  const resultComparable = comparableDate(result, interval);
  const expectedComparable = comparableDate(expected, interval);

  if (resultComparable !== expectedComparable) {
    const r = result.toISOString();
    const e = expected.toISOString();
    throw new Error(`expected "${r}" to be "${e}"`);
  }
}

export function expectDatesToBeOnTheSameDay(
  result: Date,
  expected: Date
): void {
  return expectDatesToBeOnTheSameTimeInterval(
    result,
    expected,
    TIME_INTERVAL.DAY
  );
}

export function expectDatesToBeOnTheSameMonth(
  result: Date,
  expected: Date
): void {
  return expectDatesToBeOnTheSameTimeInterval(
    result,
    expected,
    TIME_INTERVAL.MONTH
  );
}

export function expectDatesToBeOnTheSameYear(
  result: Date,
  expected: Date
): void {
  return expectDatesToBeOnTheSameTimeInterval(
    result,
    expected,
    TIME_INTERVAL.YEAR
  );
}
