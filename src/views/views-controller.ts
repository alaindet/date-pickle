import { YearPicker } from '../pickers/year-picker';
import { DatePicker } from '../pickers/date-picker';
import { MonthPicker } from '../pickers/month-picker';
import { DatePickleEventHandler, DatePickleView, DatePickleViewChangeEvent } from '../types';
import { DatePickle } from '../date-pickle';

export class DatePickleViewsController {

  private _lastView: DatePickleView | null = null;
  private _view: DatePickleView = DatePickleView.DatePicker;
  private _closeHandler?: () => void;
  private _viewChangeHandler?: DatePickleEventHandler<DatePickleViewChangeEvent>;

  constructor(private parent: DatePickle) {}

  get view(): DatePickleView {
    return this._view;
  }

  get picker(): DatePicker | MonthPicker | YearPicker {
    switch (this._view) {
    case DatePickleView.DatePicker: return this.parent.datePicker;
    case DatePickleView.MonthPicker: return this.parent.monthPicker;
    case DatePickleView.YearPicker: return this.parent.yearPicker;
    }
  }

  onChange(handler: DatePickleEventHandler<DatePickleViewChangeEvent>): void {
    this._viewChangeHandler = handler;
    const from = this._lastView;
    const to = this._view;
    if (this.parent.sync) handler({ from, to });
  }

  onClose(handler: () => void): void {
    this._closeHandler = handler;
  }

  next(): void {
    this._lastView = this._view;

    switch (this._view) {
    case DatePickleView.DatePicker:
      this._view = DatePickleView.MonthPicker;
      break;
    case DatePickleView.MonthPicker:
      this._view = DatePickleView.YearPicker;
      break;
    case DatePickleView.YearPicker:
      this._view = DatePickleView.MonthPicker;
      break;
    }

    const from = this._lastView;
    const to = this._view;
    this?._viewChangeHandler && this._viewChangeHandler({ from, to });
  }

  prev(): void {
    this._lastView = this._view;

    switch (this._view) {
    case DatePickleView.DatePicker:
      this?._closeHandler && this._closeHandler();
      break;
    case DatePickleView.MonthPicker:
      this._view = DatePickleView.DatePicker;
      break;
    case DatePickleView.YearPicker:
      this._view = DatePickleView.MonthPicker;
      break;
    }

    const from = this._lastView;
    const to = this._view;
    this?._viewChangeHandler && this._viewChangeHandler({ from, to });
  }
}
