import { DatePickle } from './date-pickle';

describe('DatePickle', () => {

  it('should update properties with corresponding methods', () => {
    const dpk = new DatePickle(new Date('2022-09-02'), 'en');

    expect(dpk.min).toBeFalsy();
    dpk.min = new Date('2022-08-01');
    expect(dpk.min).toBeTruthy();

    expect(dpk.max).toBeFalsy();
    dpk.max = new Date('2022-09-30');
    expect(dpk.max).toBeTruthy();
  });

  it('should instantiate pickers lazily', () => {
    const dpk = new DatePickle(new Date('2022-09-02'), 'en');

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
    const dpk = new DatePickle(new Date('2022-09-02'), 'en');

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
    const dpk = new DatePickle(new Date('2022-09-02'), 'en');

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
    const oldLocale = 'en';
    const newLocale = 'it';
    const dpk = new DatePickle(new Date(), oldLocale);
    expect(dpk.monthPicker.locale).toEqual(oldLocale);
    dpk.locale = newLocale;
    expect(dpk.monthPicker.locale).toEqual(newLocale);
  });
});

export {};
