import { padStart } from './pad-start';

const y = (d: Date) => String(d.getFullYear());
const m = (d: Date) => padStart(d.getMonth() + 1, '0', 2);
const d = (d: Date) => padStart(d.getDate(), '0', 2);
const h = (d: Date) => padStart(d.getHours(), '0', 2);
const i = (d: Date) => padStart(d.getMinutes(), '0', 2);

export function comparableDate(
  date: Date,
  precision: 'minute' | 'day' | 'month' | 'year',
): number {
  const toComparable = (...fns: ((d: Date) => string)[]): number => {
    return +fns.map(fn => fn(date)).join('');
  };

  switch (precision) {
    case 'minute': return toComparable(y, m, d, h, i);
    case 'day': return toComparable(y, m, d);
    case 'month': return toComparable(y, m);
    case 'year': return toComparable(y);
  }
}

export function cloneDate(d: Date): Date {
  return new Date(d.getTime());
}
