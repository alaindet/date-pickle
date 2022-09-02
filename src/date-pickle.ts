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
  private _shouldUpdate: boolean = true;

  constructor(current?: Date, locale = 'default', shouldUpdate = true) {
    this._ref = current ?? new Date();
    this._locale = locale;
    this._shouldUpdate = shouldUpdate;
  }

  get locale(): Locale { return this._locale }
  get min(): Date | undefined { return this._min }
  get max(): Date | undefined { return this._max }
  get shouldUpdate(): boolean { return this._shouldUpdate }

  get yearPicker(): YearPicker {
    if (!this._yearPicker) this.createYearPicker();
    return this._yearPicker!;
  }

  get monthPicker(): MonthPicker {
    if (!this._monthPicker) this.createMonthPicker();
    return this._monthPicker!;
  }

  get datePicker(): DatePicker {
    if (!this._datePicker) this.createDatePicker();
    return this._datePicker!;
  }

  set shouldUpdate(update: boolean) {
    this._shouldUpdate = update;
    if (this?._yearPicker) this._yearPicker.shouldUpdate = update;
    if (this?._monthPicker) this._monthPicker.shouldUpdate = update;
    if (this?._datePicker) this._datePicker.shouldUpdate = update;
  }

  set locale(locale: Locale) {
    this._locale = locale;
    if (this?._monthPicker) this._monthPicker.locale = locale;
  }

  set min(min: Date | undefined) {
    this._min = min;
    if (this?._yearPicker) this._yearPicker.min = min;
    if (this?._monthPicker) this._monthPicker.min = min;
    if (this?._datePicker) this._datePicker.min = min;
  }

  set max(max: Date | undefined) {
    this._max = max;
    if (this?._yearPicker) this._yearPicker.max = max;
    if (this?._monthPicker) this._monthPicker.max = max;
    if (this?._datePicker) this._datePicker.max = max;
  }

  set current(current: Date) {
    this._ref = current;
    if (this?._yearPicker) this._yearPicker.year = current.getFullYear();
    if (this?._datePicker) this._datePicker.current = current;
  }

  exists(picker: 'year-picker' | 'month-picker' | 'date-picker'): boolean {
    switch (picker) {
      case 'year-picker': return !!this?._yearPicker;
      case 'month-picker': return !!this?._monthPicker;
      case 'date-picker': return !!this?._datePicker;
    }
  }

  private createYearPicker(): void {
    this._yearPicker = new YearPicker(cloneDate(this._ref), false);
    this._yearPicker.min = this._min;
    this._yearPicker.max = this._max;
    this._yearPicker.shouldUpdate = true;
  }

  private createMonthPicker(): void {
    this._monthPicker = new MonthPicker(this._locale, false);
    this._monthPicker.min = this._min;
    this._monthPicker.max = this._max;
    this._monthPicker.shouldUpdate = true;
  }

  private createDatePicker(): void {
    this._datePicker = new DatePicker(cloneDate(this._ref), false);
    this._datePicker.min = this._min;
    this._datePicker.max = this._max;
    this._datePicker.shouldUpdate = true;
  }
}
