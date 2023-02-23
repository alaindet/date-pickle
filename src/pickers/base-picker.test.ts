import { YearPicker } from './year-picker/year-picker';
import { PickerOptions, TIME_INTERVAL } from '../types/index';
import { addTimeInterval, didPageChange } from '../utils';
import { DatePicker } from './date-picker/date-picker';
import { MonthPicker } from './month-picker/month-picker';

describe('Picker', () => {
  describe('constructor', () => {
    const d = new Date('2006-01-02');
    const options: PickerOptions = {
      min: d,
      max: d,
      locale: 'en',
      selected: d,
      focused: d,
    };

    it('should accept no arguments', () => {
      const picker = new DatePicker();
      expect(picker.cursor).toBeInstanceOf(Date);
    });

    it('should accept one argument of Date type', () => {
      const picker = new DatePicker(d);
      expect(picker.cursor).toEqual(d);
    });

    it('should accept one argument of PickerOptions type', () => {
      const picker = new DatePicker(options);
      expect(picker.min).toEqual(options.min);
      expect(picker.max).toEqual(options.max);
      expect(picker.locale).toEqual(options.locale);
      expect(picker.selected).toEqual(options.selected);
      expect(picker.focused).toEqual(options.focused);
    });

    it('should accept two arguments of Date and PickerOptions respectively', () => {
      const picker = new DatePicker(d, options);
      expect(picker.min).toEqual(options.min);
      expect(picker.max).toEqual(options.max);
      expect(picker.locale).toEqual(options.locale);
      expect(picker.selected).toEqual(options.selected);
      expect(picker.focused).toEqual(options.focused);
    });

    it('should throw error on invalid input', () => {
      expect(() => new DatePicker(options, options)).toThrowError();
      expect(() => new DatePicker({}, {})).toThrowError();
      expect(() => new DatePicker(options, {})).toThrowError();
    });
  });

  describe('event handlers', () => {
    it('should register/unregister an event handler for itemsChange event', async () => {
      const picker = new DatePicker();
      let counter = 0;
      const immediate = true;
      picker.onItemsChange(() => counter++, immediate);
      picker.next();
      picker.clearItemsChangeEventListener();
      picker.next();
      expect(counter).toEqual(2);
    });

    it('should register/unregister an event handler for selectedChange event', async () => {
      const picker = new MonthPicker();
      let counter = 0;
      const immediate = true;
      picker.onSelectedChange(() => counter++, immediate);
      picker.selected = addTimeInterval(picker.cursor, 3, TIME_INTERVAL.MONTH);
      picker.clearSelectedChangeEventListener();
      picker.selected = addTimeInterval(picker.cursor, 3, TIME_INTERVAL.MONTH);
      expect(counter).toEqual(2);
    });

    it('should register/unregister an event handler for focusedChange event', async () => {
      const picker = new YearPicker();
      let counter = 0;
      const immediate = true;
      picker.onFocusedChange(() => counter++, immediate);
      picker.focused = addTimeInterval(picker.cursor, 3, TIME_INTERVAL.YEAR);
      picker.clearFocusedChangeEventListener();
      picker.focused = addTimeInterval(picker.cursor, 3, TIME_INTERVAL.YEAR);
      expect(counter).toEqual(2);
    });

    it('should change page when selected is out of scope', () => {
      const d = new Date('2022-08-08');
      const picker = new DatePicker(d);
      const selected = addTimeInterval(d, 3, TIME_INTERVAL.MONTH);
      const pageChanged = didPageChange(
        picker,
        () => (picker.selected = selected)
      );
      expect(pageChanged).toBeTruthy();
    });

    it('should change page when focused is out of scope', () => {
      const d = new Date('2022-08-08');
      const picker = new MonthPicker(d);
      const focused = addTimeInterval(d, 2, TIME_INTERVAL.YEAR);
      const pageChanged = didPageChange(
        picker,
        () => (picker.focused = focused)
      );
      expect(pageChanged).toBeTruthy();
    });
  });
});
