import { cloneDate, getUniqueDayId } from '../../utils';
import { DayItem, PickerOptions, TIME_INTERVAL } from '../../types';
import { BasePicker } from '../base-picker';

export class DatePicker extends BasePicker<DayItem> {

  constructor(ref?: Date | PickerOptions, options?: PickerOptions) {
    super(ref, options);
    this._focusOffset = 7; // Jumps one week by default
    this._interval = TIME_INTERVAL.DAY;
    this.updateItems();
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

  protected buildItems(): DayItem[] {
    const days = this.getDaysInCurrentMonth();
    days.unshift(...this.getDaysInPreviousMonth());
    days.push(...this.getDaysInNextMonth());
    return this.toCalendarDays(days);
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

    while(d.getUTCMonth() === theMonth) {
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
    const selectedComp = this.toComparable(this?.selected);
    const focusedComp = this.toComparable(this?.focused);

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
    if (this._min) {
      const minComp = this.toComparable(this.min)!;
      inf = minComp > this.toComparable(inf)! ? this._min! : inf;
    }

    // Restrict range from top?
    if (this._max) {
      const maxComp = this.toComparable(this._max)!;
      sup = maxComp < this.toComparable(sup)! ? this._max! : sup;
    }

    return [inf, sup];
  }
}
