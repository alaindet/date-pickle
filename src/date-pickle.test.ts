import { DatePickle } from './date-pickle';
import { expectDatesToBeOnTheSameDay, expectDatesToBeOnTheSameMonth, expectDatesToBeOnTheSameYear } from './tests/matchers';

const locale = 'en';

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

    expect(dpk.existsYearPicker()).toBeFalsy();
    dpk.yearPicker;
    expect(dpk.existsYearPicker()).toBeTruthy();

    expect(dpk.existsMonthPicker()).toBeFalsy();
    dpk.monthPicker;
    expect(dpk.existsMonthPicker()).toBeTruthy();

    expect(dpk.existsDatePicker()).toBeFalsy();
    dpk.datePicker;
    expect(dpk.existsDatePicker()).toBeTruthy();
  });

  it('should propagate min value to pickers', () => {
    const d = new Date('2022-09-02');
    const dpk = new DatePickle(d, { locale });

    const expectMinDatePropagated = (min: Date) => {
      dpk.min = min;
      expect(dpk.yearPicker.min).toEqual(min);
      expect(dpk.monthPicker.min).toEqual(min);
      expect(dpk.datePicker.min).toEqual(min);
    };

    const oldMin = new Date('2020-01-01');
    dpk.min = oldMin;
    expectMinDatePropagated(oldMin);

    const newMin = new Date('2021-02-03');
    dpk.min = newMin;
    expectMinDatePropagated(newMin);
  });

  it('should propagate max value to pickers', () => {
    const d = new Date('2022-09-02');
    const dpk = new DatePickle(d, { locale });

    const expectMaxDatePropagated = (max: Date) => {
      dpk.max = max;
      expect(dpk.yearPicker.max).toEqual(max);
      expect(dpk.monthPicker.max).toEqual(max);
      expect(dpk.datePicker.max).toEqual(max);
    };

    const oldMax = new Date('2020-01-01');
    dpk.max = oldMax;
    expectMaxDatePropagated(oldMax);

    const newMax = new Date('2020-01-01');
    dpk.max = newMax;
    expectMaxDatePropagated(newMax);
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
    expectDatesToBeOnTheSameYear(yearPicker.selected!, selected);
    expectDatesToBeOnTheSameMonth(monthPicker.selected!, selected);
    expectDatesToBeOnTheSameDay(datePicker.selected!, selected);
  });

  it('should propagate focused value to pickers', () => {
    const d = new Date('2022-04-04');
    const focused = new Date('2022-05-05');
    const dpk = new DatePickle(d);
    const yearPicker = dpk.yearPicker;
    const monthPicker = dpk.monthPicker;
    const datePicker = dpk.datePicker;
    dpk.focused = focused;
    expectDatesToBeOnTheSameYear(yearPicker.focused!, focused);
    expectDatesToBeOnTheSameMonth(monthPicker.focused!, focused);
    expectDatesToBeOnTheSameDay(datePicker.focused!, focused);
  });
});
