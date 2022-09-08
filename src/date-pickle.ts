import { YearPicker } from './pickers/year-picker';
import { MonthPicker } from './pickers/month-picker';
import { DatePicker } from './pickers/date-picker';
import { Locale, PickerOptions } from './types';
import { cloneDate } from './utils';

export class DatePickle {

  // Pickers
  private _yearPicker?: YearPicker;
  private _monthPicker?: MonthPicker;
  private _datePicker?: DatePicker;

  // Properties
  private _ref!: Date;
  private _locale!: Locale;
  private _min?: Date;
  private _max?: Date;
  private _selected?: Date;
  private _focused?: Date;
  private _sync = true;

  constructor(ref?: Date, options?: PickerOptions) {
    this._ref = ref ?? new Date();
    if (options?.min) this._min = options.min;
    if (options?.max) this._max = options.max;
    if (options?.sync) this._sync = options.sync;
    if (options?.locale) this._locale = options.locale;
    if (options?.selected) this._selected = options.selected;
    if (options?.focused) this._focused = options.focused;
  }

  get locale(): Locale {
    return this._locale;
  }

  set locale(locale: Locale) {
    this._locale = locale;
    if (this?._yearPicker) this._yearPicker.locale = locale;
    if (this?._monthPicker) this._monthPicker.locale = locale;
    if (this?._datePicker) this._datePicker.locale = locale;
  }

  get min(): Date | undefined {
    return this._min;
  }

  set min(min: Date | undefined) {
    this._min = min;
    if (this?._yearPicker) this._yearPicker.min = min;
    if (this?._monthPicker) this._monthPicker.min = min;
    if (this?._datePicker) this._datePicker.min = min;
  }

  get max(): Date | undefined {
    return this._max;
  }

  set max(max: Date | undefined) {
    this._max = max;
    if (this?._yearPicker) this._yearPicker.max = max;
    if (this?._monthPicker) this._monthPicker.max = max;
    if (this?._datePicker) this._datePicker.max = max;
  }

  get sync(): boolean {
    return this._sync;
  }

  set sync(update: boolean) {
    this._sync = update;
    if (this?._yearPicker) this._yearPicker.sync = update;
    if (this?._monthPicker) this._monthPicker.sync = update;
    if (this?._datePicker) this._datePicker.sync = update;
  }

  get selected(): Date | undefined {
    return this._selected;
  }

  set selected(selected: Date | undefined) {
    this._selected = selected;
    if (this?._yearPicker) this._yearPicker.selected = selected;
    if (this?._monthPicker) this._monthPicker.selected = selected;
    if (this?._datePicker) this._datePicker.selected = selected;
  }

  get focused(): Date | undefined {
    return this._focused;
  }

  set focused(focused: Date | undefined) {
    this._focused = focused;
    if (this?._yearPicker) this._yearPicker.focused = focused;
    if (this?._monthPicker) this._monthPicker.focused = focused;
    if (this?._datePicker) this._datePicker.focused = focused;
  }

  get yearPicker(): YearPicker {
    if (!this._yearPicker) {
      const options = this.getInitialOptions();
      this._yearPicker = new YearPicker(cloneDate(this._ref), options);
    }
    return this._yearPicker!;
  }

  get monthPicker(): MonthPicker {
    if (!this._monthPicker) {
      const options = this.getInitialOptions();
      this._monthPicker = new MonthPicker(cloneDate(this._ref), options);
    }
    return this._monthPicker!;
  }

  get datePicker(): DatePicker {
    if (!this._datePicker) {
      const options = this.getInitialOptions();
      this._datePicker = new DatePicker(cloneDate(this._ref), options);
    }
    return this._datePicker!;
  }

  set ref(ref: Date) {
    this._ref = ref;
    if (this?._yearPicker) this._yearPicker.ref = ref;
    if (this?._datePicker) this._datePicker.ref = ref;
  }

  existsYearPicker(): boolean {
    return !!this?._yearPicker;
  }

  existsMonthPicker(): boolean {
    return !!this?._monthPicker;
  }

  existsDatePicker(): boolean {
    return !!this?._datePicker;
  }

  private getInitialOptions(): PickerOptions {
    return {
      min: this._min,
      max: this._max,
      locale: this._locale,
      selected: this._selected,
      focused: this._selected,
    };
  }
}
