import { DatePickle } from './date-pickle';

describe('DatePickle', () => {

  it('should update properties with corresponding methods', () => {
    const ds = new DatePickle(new Date('2022-09-02'), 'en');

    expect(ds.min).toBeFalsy();
    ds.setMin(new Date('2022-08-01'));
    expect(ds.min).toBeTruthy();

    expect(ds.max).toBeFalsy();
    ds.setMax(new Date('2022-09-30'));
    expect(ds.max).toBeTruthy();
  });

  it('should instantiate pickers lazily', () => {
    const ds = new DatePickle(new Date('2022-09-02'), 'en');

    expect(ds.exists('year-picker')).toBeFalsy();
    ds.yearPicker;
    expect(ds.exists('year-picker')).toBeTruthy();

    expect(ds.exists('month-picker')).toBeFalsy();
    ds.monthPicker;
    expect(ds.exists('month-picker')).toBeTruthy();

    expect(ds.exists('date-picker')).toBeFalsy();
    ds.datePicker;
    expect(ds.exists('date-picker')).toBeTruthy();
  });

  it('should propagate min value to pickers', () => {
    const ds = new DatePickle(new Date('2022-09-02'), 'en');

    const assertMinPropagated = (min: Date) => {
      const minTimestamp = min.getTime();
      ds.setMin(min, false);
      expect(ds.yearPicker.getMin()?.getTime()).toEqual(minTimestamp);
      expect(ds.monthPicker.getMin()?.getTime()).toEqual(minTimestamp);
      expect(ds.datePicker.getMin()?.getTime()).toEqual(minTimestamp);
    };

    const oldMin = new Date('2020-01-01');
    ds.setMin(oldMin);
    assertMinPropagated(oldMin);

    const newMin = new Date('2021-02-03');
    ds.setMin(newMin);
    assertMinPropagated(newMin);
  });

  it('should propagate max value to pickers', () => {
    const ds = new DatePickle(new Date('2022-09-02'), 'en');

    const assertMaxPropagated = (max: Date) => {
      const maxTimestamp = max.getTime();
      ds.setMax(max, false);
      expect(ds.yearPicker.getMax()?.getTime()).toEqual(maxTimestamp);
      expect(ds.monthPicker.getMax()?.getTime()).toEqual(maxTimestamp);
      expect(ds.datePicker.getMax()?.getTime()).toEqual(maxTimestamp);
    };

    const oldMax = new Date('2020-01-01');
    ds.setMax(oldMax);
    assertMaxPropagated(oldMax);

    const newMax = new Date('2020-01-01');
    ds.setMax(newMax);
    assertMaxPropagated(newMax);
  });

  it('should propagate locale value to pickers', () => {
    const oldLocale = 'en';
    const newLocale = 'it';
    const ds = new DatePickle(new Date(), oldLocale);
    expect(ds.monthPicker.getLocale()).toEqual(oldLocale);
    ds.setLocale(newLocale);
    expect(ds.monthPicker.getLocale()).toEqual(newLocale);
  });
});

export {};
