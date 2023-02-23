import { TIME_INTERVAL } from '../types';
import { comparableDate, cloneDate, addTimeInterval, getUniqueYearId, getUniqueMonthId, getUniqueDayId } from './dates';
import { expectDatesToBeOnTheSameDay } from '../tests/matchers';

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
});

describe('cloneDate() utility function', () => {
  it('should clone the Date', () => {
    const d1 = new Date();
    const d2 = cloneDate(d1);
    d1.setDate(d1.getDate() + 1);
    expect(d1.getDate()).not.toEqual(d2.getDate());
  });
});

describe('addTimeInterval() utility function', () => {

  it('should subtract 1 day interval', () => {
    const input = new Date('2023-03-01');
    const result = addTimeInterval(input, -1, TIME_INTERVAL.DAY);
    const expected = new Date('2023-02-28');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  it('should add 1 day interval', () => {
    const input = new Date('2023-03-09');
    const result = addTimeInterval(input, 1, TIME_INTERVAL.DAY);
    const expected = new Date('2023-03-10');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  it('should add 1 month interval', () => {
    const input = new Date('2023-03-09');
    const result = addTimeInterval(input, 1, TIME_INTERVAL.MONTH);
    const expected = new Date('2023-04-09');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  it('should subtract 1 month interval', () => {
    const input = new Date('2023-03-09');
    const result = addTimeInterval(input, -1, TIME_INTERVAL.MONTH);
    const expected = new Date('2023-02-09');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  // Edge case
  it('should subtract 1 month without changing month', () => {
    const input = new Date('2024-03-31');
    const result = addTimeInterval(input, -1, TIME_INTERVAL.MONTH);
    const expected = new Date('2024-03-02');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  it('should add 1 year interval', () => {
    const input = new Date('2023-03-03');
    const result = addTimeInterval(input, 1, TIME_INTERVAL.YEAR);
    const expected = new Date('2024-03-03');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  it('should subtract 1 year interval', () => {
    const input = new Date('2023-03-03');
    const result = addTimeInterval(input, -1, TIME_INTERVAL.YEAR);
    const expected = new Date('2022-03-03');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  it('should subtract 1 year interval also changing month', () => {
    const input = new Date('2024-02-29');
    const result = addTimeInterval(input, -1, TIME_INTERVAL.YEAR);
    const expected = new Date('2023-03-01');
    expectDatesToBeOnTheSameDay(result, expected);
  });

  describe('getUniqueYearId() utility function', () => {
    it('should given unique year ID', () => {
      const result = getUniqueYearId(new Date('2012-03-09'));
      expect(result).toEqual(20129999);
    });
  });

  describe('getUniqueMonthId() utility function', () => {
    it('should given unique month ID', () => {
      const result = getUniqueMonthId(new Date('2012-03-09'));
      expect(result).toEqual(20120399);
    });
  });

  describe('getUniqueDayId() utility function', () => {
    it('should given unique day ID', () => {
      const result = getUniqueDayId(new Date('2012-03-09'));
      expect(result).toEqual(20120309);
    });
  });
});
