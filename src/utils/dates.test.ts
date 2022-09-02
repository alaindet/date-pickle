import { comparableDate, cloneDate } from './dates';

describe('comparableDate() utility function', () => {
  it('should compare year', () => {
    const d1 = new Date('2022-01-20');
    const d2 = new Date('2022-06-26');
    const d1Comparable = comparableDate(d1, 'year');
    const d2Comparable = comparableDate(d2, 'year');
    expect(d1Comparable).toEqual(d2Comparable);
  });

  it('should compare year and month', () => {
    const d1 = new Date('2022-08-08');
    const d2 = new Date('2022-08-26');
    const d1Comparable = comparableDate(d1, 'month');
    const d2Comparable = comparableDate(d2, 'month');
    expect(d1Comparable).toEqual(d2Comparable);
  });

  it('should compare year, month and day', () => {
    const d1 = new Date('2022-05-06 10:11:12');
    const d2 = new Date('2022-05-06 12:11:10');
    const d1Comparable = comparableDate(d1, 'day');
    const d2Comparable = comparableDate(d2, 'day');
    expect(d1Comparable).toEqual(d2Comparable);
  });

  it('should compare year, month, day, hour and minute', () => {
    const d1 = new Date('2022-05-06 10:11:20');
    const d2 = new Date('2022-05-06 10:11:50');
    const d1Comparable = comparableDate(d1, 'minute');
    const d2Comparable = comparableDate(d2, 'minute');
    expect(d1Comparable).toEqual(d2Comparable);
  });
});

describe('cloneDate() utility function', () => {
  it('should clone the Date', () => {
    const d1 = new Date();
    const d2 = cloneDate(d1);
    d1.setDate(d1.getDate() + 1);
    expect(d1.getDate()).not.toEqual(d2.getDate());
  });
});

export {};
