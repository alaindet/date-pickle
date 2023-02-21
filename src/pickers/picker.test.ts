import { PickerOptions } from './../types/index';
import { DatePicker } from '../pickers/date-picker/date-picker';

describe('Picker', () => {
  describe('constructor', () => {

    const d = new Date('2006-01-02');
    const options: PickerOptions = {
      min: d,
      max: d,
      locale: 'en',
      selected: d,
      focused: d,
      sync: false,
    };

    it('should accept no arguments', () => {
      const picker = new DatePicker();
      expect(picker.ref).toBeInstanceOf(Date);
    });

    it('should accept one argument of Date type', () => {
      const picker = new DatePicker(d);
      expect(picker.ref).toEqual(d);
    });

    it('should accept one argument of PickerOptions type', () => {
      const picker = new DatePicker(options);
      expect(picker.min).toEqual(options.min);
      expect(picker.max).toEqual(options.max);
      expect(picker.locale).toEqual(options.locale);
      expect(picker.selected).toEqual(options.selected);
      expect(picker.focused).toEqual(options.focused);
      expect(picker.sync).toEqual(options.sync);
    });

    it('should accept two arguments of Date and PickerOptions respectively', () => {
      const picker = new DatePicker(d, options);
      expect(picker.min).toEqual(options.min);
      expect(picker.max).toEqual(options.max);
      expect(picker.locale).toEqual(options.locale);
      expect(picker.selected).toEqual(options.selected);
      expect(picker.focused).toEqual(options.focused);
      expect(picker.sync).toEqual(options.sync);
    });

    it('should throw error on invalid input', () => {
      expect(() => new DatePicker(options, options)).toThrowError();
      expect(() => new DatePicker({}, {})).toThrowError();
      expect(() => new DatePicker(options, {})).toThrowError();
    });
  });
});
