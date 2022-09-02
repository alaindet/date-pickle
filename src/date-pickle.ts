import { YearPicker } from './pickers/year-picker';
import { MonthPicker } from './pickers/month-picker';
import { DatePicker } from './pickers/date-picker';
import { Locale } from './types';
import { cloneDate } from './utils';

export class DatePickle {

  private _yearPicker?: YearPicker;
  private _monthPicker?: MonthPicker;
  private _datePicker?: DatePicker;

  private _ref!: Date;
  private _locale!: Locale;
  private _min?: Date;
  private _max?: Date;

  constructor(current?: Date, locale = 'default') {
    this._ref = current ?? new Date();
    this._locale = locale;
  }

  get locale(): Locale { return this._locale }
  get min(): Date | undefined { return this._min }
  get max(): Date | undefined { return this._max }

  get yearPicker(): YearPicker {
    if (!this._yearPicker) {
      this._yearPicker = new YearPicker(cloneDate(this._ref));
      this._min && this._yearPicker.setMin(this._min, false);
      this._max && this._yearPicker.setMax(this._max, false);
      this._yearPicker.updateItems();
    }
    return this._yearPicker;
  }

  get monthPicker(): MonthPicker {
    if (!this._monthPicker) {
      this._monthPicker = new MonthPicker(this._locale);
      this._min && this._monthPicker.setMin(this._min, false);
      this._max && this._monthPicker.setMax(this._max, false);
      this._monthPicker.updateItems();
    }
    return this._monthPicker;
  }

  get datePicker(): DatePicker {
    if (!this._datePicker) {
      this._datePicker = new DatePicker(cloneDate(this._ref));
      this._min && this._datePicker.setMin(this._min, false);
      this._max && this._datePicker.setMax(this._max, false);
      this._datePicker.updateItems();
    }
    return this._datePicker;
  }

  setMin(min: Date, update = true): void {
    this._min = min;
    this._yearPicker?.setMin(min, update);
    this._monthPicker?.setMin(min, update);
    this._datePicker?.setMin(min, update);
  }

  setMax(max: Date, update = true): void {
    this._max = max;
    this._yearPicker?.setMax(max, update);
    this._monthPicker?.setMax(max, update);
    this._datePicker?.setMax(max, update);
  }

  setLocale(locale: Locale, update = true): void {
    this._locale = locale;
    this._monthPicker?.setLocale(locale, update);
  }

  setCurrent(current: Date, update = true): void {
    this._ref = current;
    this._yearPicker?.setYear(this._ref.getFullYear(), update);
    this._datePicker?.setCurrent(this._ref);
  }

  exists(picker: 'year-picker' | 'month-picker' | 'date-picker'): boolean {
    switch (picker) {
      case 'year-picker': return !!this?._yearPicker;
      case 'month-picker': return !!this?._monthPicker;
      case 'date-picker': return !!this?._datePicker;
    }
  }
}
