import { cloneDate, comparableDate } from '../utils';
import { DayItem } from '../types';
import { Picker } from './picker';

export class DatePicker extends Picker<DayItem> {

  /**
   * Shows some days of prev and next month to fill the week (starts on monday)
   *
   * Ex.:
   * - If first day of current month is wednesday, show prev month's last 2 days
   * - If last day of current month is thursday, show next months' first 3 days
   */
  private _peek = true;

  constructor(current?: Date, shouldUpdate = true) {
    super(current, shouldUpdate);
  }

  get peek(): boolean {
    return this._peek;
  }

  set peek(peek: boolean) {
    this._peek = peek;
    this.updateItems();
  }

  next(): void {
    this._ref.setDate(15);
    this._ref.setMonth(this._ref.getMonth() + 1);
    this.updateItems();
  }

  prev(): void {
    this._ref.setDate(15);
    this._ref.setMonth(this._ref.getMonth() - 1);
    this.updateItems();
  }

  protected buildItems(): DayItem[] {

    const days = this.getDaysInCurrentMonth();

    if (this._peek) {
      days.unshift(...this.getDaysInPreviousMonth());
      days.push(...this.getDaysInNextMonth());
    }

    return this.toCalendarDays(days);
  }

  private getDaysInCurrentMonth(): Date[] {
    return this.getDaysInMonth(this._ref.getFullYear(), this._ref.getMonth());
  }

  private getDaysInPreviousMonth(): Date[] {
    const d = cloneDate(this._ref);
    d.setDate(15);
    d.setMonth(d.getMonth() - 1);
    const days = this.getDaysInMonth(d.getFullYear(), d.getMonth());
    const lastDayOfPrevMonth = days[days.length - 1];
    const lastWeekday = lastDayOfPrevMonth.getDay();
    const offset = -lastWeekday;
    if (offset === 0) {
      return [];
    }
    return days.slice(-lastWeekday);
  }

  private getDaysInNextMonth(): Date[] {
    const d = cloneDate(this._ref);
    d.setDate(15);
    d.setMonth(d.getMonth() + 1);
    const days = this.getDaysInMonth(d.getFullYear(), d.getMonth());
    const firstDayOfNextMonth = days[0];
    const firstWeekday = firstDayOfNextMonth.getDay();
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
    const d = new Date(year, month, 1);
    const currentMonth = d.getMonth();
    const days: Date[] = [];

    while(d.getMonth() === currentMonth) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    return days;
  }

  private toCalendarDays(dates: Date[]): DayItem[] {
    const [inf, sup] = this.getAllowedDateRange();
    const infComp = comparableDate(inf, 'day');
    const supComp = comparableDate(sup, 'day');

    const todayComp = comparableDate(new Date(), 'day');
    const SUNDAY = 0;
    const SATURDAY = 6;

    return dates.map(d => {
      const dateComp = comparableDate(d, 'day');
      const weekday = d.getDay();

      return {
        date: d,
        isWeekend: weekday === SUNDAY || weekday === SATURDAY,
        isCurrent: dateComp === todayComp,
        isDisabled: dateComp < infComp || dateComp > supComp,
      };
    });
  }

  private getFirstDayOfCurrentMonth(): Date {
    const d = cloneDate(this._ref);
    d.setDate(1);
    return d;
  }

  private getLastDayOfCurrentMonth(): Date {
    const d = cloneDate(this._ref);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(d.getDate() - 1);
    return d;
  }

  private getAllowedDateRange(): [Date, Date] {
    let inf = this.getFirstDayOfCurrentMonth();
    let sup = this.getLastDayOfCurrentMonth();

    // Restrict range from bottom?
    if (this._min) {
      const minComparable = comparableDate(this._min!, 'day');
      inf = minComparable > comparableDate(inf, 'day') ? this._min! : inf;
    }

    // Restrict range from top?
    if (this._max) {
      const maxComparable = comparableDate(this._max!, 'day');
      sup = maxComparable < comparableDate(sup, 'day') ? this._max! : sup;
    }

    return [inf, sup];
  }
}
