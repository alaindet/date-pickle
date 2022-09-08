import { DatePickle } from './date-pickle';
import { comparableDate } from './utils';
import { PickerType } from './types';

const locale = 'en';
const year = (d: Date) => comparableDate(d, 'year');
const month = (d: Date) => comparableDate(d, 'month');
const day = (d: Date) => comparableDate(d, 'day');

describe('DatePickle', () => {

  it('should update properties with corresponding methods', () => {
    const d = new Date('2022-09-02');
    const dpk = new DatePickle(d, { locale });

    expect(dpk.min).toBeFalsy();
    dpk.min = new Date('2022-08-01');
    expect(dpk.min).toBeTruthy();

    expect(dpk.max).toBeFalsy();
    dpk.max = new Date('2022-09-30');
    expect(dpk.max).toBeTruthy();
  });

  it('should instantiate pickers lazily', () => {
    const d = new Date('2022-09-02');
    const dpk = new DatePickle(d, { locale });

    expect(dpk.exists(PickerType.YearPicker)).toBeFalsy();
    dpk.yearPicker;
    expect(dpk.exists(PickerType.YearPicker)).toBeTruthy();

    expect(dpk.exists(PickerType.MonthPicker)).toBeFalsy();
    dpk.monthPicker;
    expect(dpk.exists(PickerType.MonthPicker)).toBeTruthy();

    expect(dpk.exists(PickerType.DatePicker)).toBeFalsy();
    dpk.datePicker;
    expect(dpk.exists(PickerType.DatePicker)).toBeTruthy();
  });

  it('should propagate min value to pickers', () => {
    const d = new Date('2022-09-02');
    const dpk = new DatePickle(d, { locale });

    const assertMinPropagated = (min: Date) => {
      const minTimestamp = min.getTime();
      dpk.min = min;
      expect(dpk.yearPicker.min?.getTime()).toEqual(minTimestamp);
      expect(dpk.monthPicker.min?.getTime()).toEqual(minTimestamp);
      expect(dpk.datePicker.min?.getTime()).toEqual(minTimestamp);
    };

    const oldMin = new Date('2020-01-01');
    dpk.min = oldMin;
    assertMinPropagated(oldMin);

    const newMin = new Date('2021-02-03');
    dpk.min = newMin;
    assertMinPropagated(newMin);
  });

  it('should propagate max value to pickers', () => {
    const d = new Date('2022-09-02');
    const dpk = new DatePickle(d, { locale });

    const assertMaxPropagated = (max: Date) => {
      const maxTimestamp = max.getTime();
      dpk.max = max;
      expect(dpk.yearPicker.max?.getTime()).toEqual(maxTimestamp);
      expect(dpk.monthPicker.max?.getTime()).toEqual(maxTimestamp);
      expect(dpk.datePicker.max?.getTime()).toEqual(maxTimestamp);
    };

    const oldMax = new Date('2020-01-01');
    dpk.max = oldMax;
    assertMaxPropagated(oldMax);

    const newMax = new Date('2020-01-01');
    dpk.max = newMax;
    assertMaxPropagated(newMax);
  });

  it('should propagate locale value to pickers', () => {
    const d = new Date();
    const oldLocale = 'en';
    const newLocale = 'it';
    const dpk = new DatePickle(d, { locale: oldLocale });
    expect(dpk.monthPicker.locale).toEqual(oldLocale);
    dpk.locale = newLocale;
    expect(dpk.monthPicker.locale).toEqual(newLocale);
  });

  it('should propagate selected value to pickers', () => {
    const d = new Date('2022-04-04');
    const selected = new Date('2022-05-05');
    const dpk = new DatePickle(d);
    const yearPicker = dpk.yearPicker;
    const monthPicker = dpk.monthPicker;
    const datePicker = dpk.datePicker;
    dpk.selected = selected;
    expect(year(yearPicker.selected!)).toEqual(year(selected));
    expect(month(monthPicker.selected!)).toEqual(month(selected));
    expect(day(datePicker.selected!)).toEqual(day(selected));
  });

  it('should propagate focused value to pickers', () => {
    const d = new Date('2022-04-04');
    const focused = new Date('2022-05-05');
    const dpk = new DatePickle(d);
    const yearPicker = dpk.yearPicker;
    const monthPicker = dpk.monthPicker;
    const datePicker = dpk.datePicker;
    dpk.focused = focused;
    expect(year(yearPicker.focused!)).toEqual(year(focused));
    expect(month(monthPicker.focused!)).toEqual(month(focused));
    expect(day(datePicker.focused!)).toEqual(day(focused));
  });
});

export {};
