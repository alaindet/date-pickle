import { capitalize, cloneDate, getUniqueDayId } from '../../utils';
import { DayItem, PickerEventHandler, PickerOptions, TIME_INTERVAL } from '../../types';
import { BasePicker } from '../base-picker';

export class DatePicker extends BasePicker<DayItem> {
  constructor(cursor?: Date | PickerOptions, options?: PickerOptions) {
    super(cursor, options);
    this.props.focusOffset = 7; // Jumps one week by default
    this.props.interval = TIME_INTERVAL.DAY;
    this.updateState();
  }

  next(): void {
    const cursor = cloneDate(this._cursor);
    cursor.setUTCDate(15);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    this.cursor = cursor;
  }

  prev(): void {
    const cursor = cloneDate(this._cursor);
    cursor.setUTCDate(15);
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
    this.cursor = cursor;
  }

  onWeekdaysChange(
    handler: PickerEventHandler<string[]>,
    immediate = false
  ): void {
    this.handlers.weekdaysChange = handler;
    if (immediate) handler(this._weekdays);
  }

  clearWeekdaysChangeEventListener(): void {
    delete this.handlers.weekdaysChange;
  }

  protected buildItems(): DayItem[] {
    const days = this.getDaysInCurrentMonth();
    days.unshift(...this.getDaysInPreviousMonth());
    days.push(...this.getDaysInNextMonth());
    return this.toCalendarDays(days);
  }

  // Ex.: "March 2023"
  protected buildTitle(): string {
    const date = this._items[15].date;
    const year = date.getFullYear();
    let month = date.toLocaleString(this.props.locale, { month: 'long' });
    month = capitalize(month);
    return `${month} ${year}`;
  }

  // Ex.: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
  protected buildWeekdays(): string[] {
    return this._items.slice(0, 7).map(item => {
      let weekday = item.date.toLocaleString(this.props.locale, { weekday: 'long' });
      weekday = capitalize(weekday);
      return weekday.slice(0, this.props.weekdaysLength);
    });
  }

  private getDaysInCurrentMonth(): Date[] {
    const y = this._cursor.getUTCFullYear();
    const m = this._cursor.getUTCMonth();
    return this.getDaysInMonth(y, m);
  }

  private getDaysInPreviousMonth(): Date[] {
    const d = cloneDate(this._cursor);
    d.setUTCDate(15);
    d.setUTCMonth(d.getUTCMonth() - 1);
    const days = this.getDaysInMonth(d.getUTCFullYear(), d.getUTCMonth());
    const lastDayOfPrevMonth = days[days.length - 1];
    const lastWeekday = lastDayOfPrevMonth.getUTCDay();
    const offset = -lastWeekday;
    if (offset === 0) return [];
    return days.slice(-lastWeekday);
  }

  private getDaysInNextMonth(): Date[] {
    const d = cloneDate(this._cursor);
    d.setUTCDate(15);
    d.setUTCMonth(d.getUTCMonth() + 1);
    const days = this.getDaysInMonth(d.getUTCFullYear(), d.getUTCMonth());
    const firstDayOfNextMonth = days[0];
    const firstWeekday = firstDayOfNextMonth.getUTCDay();
    let offset = 8 - firstWeekday;
    if (offset === 7) {
      return [];
    } else if (offset === 8) {
      offset = 1;
    }
    return days.slice(0, 8 - firstWeekday);
  }

  // Thanks to https://bobbyhadz.com/blog/javascript-get-all-dates-in-month
  private getDaysInMonth(year: number, month: number): Date[] {
    const d = new Date(Date.UTC(year, month, 1));
    const theMonth = d.getUTCMonth();
    const days: Date[] = [];

    while (d.getUTCMonth() === theMonth) {
      days.push(new Date(d.getTime()));
      d.setUTCDate(d.getUTCDate() + 1);
    }

    return days;
  }

  private toCalendarDays(dates: Date[]): DayItem[] {
    const [inf, sup] = this.getAllowedDateRange();
    const infComp = this.toComparable(inf)!;
    const supComp = this.toComparable(sup)!;

    const SUNDAY = 0;
    const SATURDAY = 6;
    const nowComp = this.toComparable(new Date());
    const selectedComp = this.toComparable(this.props?.selected);
    const focusedComp = this.toComparable(this.props?.focused);

    return dates.map(d => {
      const itemComp = this.toComparable(d)!;
      const weekday = d.getUTCDay();
      const day = d.getUTCDate();

      return {
        id: getUniqueDayId(d),
        label: `${day}`,
        date: d,
        isWeekend: weekday === SUNDAY || weekday === SATURDAY,
        isNow: itemComp === nowComp,
        isDisabled: itemComp < infComp || itemComp > supComp,
        isSelected: itemComp === selectedComp,
        isFocused: itemComp === focusedComp,
      };
    });
  }

  private getFirstDayOfCurrentMonth(): Date {
    const d = cloneDate(this._cursor);
    d.setUTCDate(1);
    return d;
  }

  private getLastDayOfCurrentMonth(): Date {
    const d = cloneDate(this._cursor);
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + 1);
    d.setUTCDate(d.getUTCDate() - 1);
    return d;
  }

  private getAllowedDateRange(): [Date, Date] {
    let inf = this.getFirstDayOfCurrentMonth();
    let sup = this.getLastDayOfCurrentMonth();

    // Restrict range from bottom?
    if (this.props.min) {
      const minComp = this.toComparable(this.min)!;
      inf = minComp > this.toComparable(inf)! ? this.props.min! : inf;
    }

    // Restrict range from top?
    if (this.props.max) {
      const maxComp = this.toComparable(this.props.max)!;
      sup = maxComp < this.toComparable(sup)! ? this.props.max! : sup;
    }

    return [inf, sup];
  }
}
