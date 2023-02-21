import { TimeInterval } from '../../types';
import { comparableDate } from '../../utils';

export function expectDateToEqualWithinInterval(
  result: Date,
  expected: Date,
  interval: TimeInterval,
): void {
  const resultComparable = comparableDate(result, interval);
  const expectedComparable = comparableDate(expected, interval);

  if (resultComparable !== expectedComparable) {
    const r = result.toISOString();
    const e = expected.toISOString();
    throw new Error(`expected "${r}" to be "${e}"`);
  }
}
