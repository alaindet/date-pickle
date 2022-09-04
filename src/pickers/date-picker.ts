import { cloneDate, comparableDate } from '../utils';
import { DayItem } from '../types';
import { Picker } from './picker';

export class DatePicker extends Picker<DayItem> {

  constructor(current?: Date, shouldUpdate = true) {
    super(current, shouldUpdate);
  }

  next(): void {
    this._ref.setUTCDate(15);
    this._ref.setUTCMonth(this._ref.getUTCMonth() + 1);
    this.updateItems();
  }

  prev(): void {
    this._ref.setUTCDate(15);
    this._ref.setUTCMonth(this._ref.getUTCMonth() - 1);
    this.updateItems();
  }

  protected buildItems(): DayItem[] {

    const days = this.getDaysInCurrentMonth();

    // TODO: Peek?
    if (true) {
      days.unshift(...this.getDaysInPreviousMonth());
      days.push(...this.getDaysInNextMonth());
    }

    return this.toCalendarDays(days);
  }

  private getDaysInCurrentMonth(): Date[] {
    return this.getDaysInMonth(
      this._ref.getUTCFullYear(),
      this._ref.getUTCMonth(),
    );
  }

  private getDaysInPreviousMonth(): Date[] {
    const d = cloneDate(this._ref);
    d.setUTCDate(15);
    d.setUTCMonth(d.getUTCMonth() - 1);
    const days = this.getDaysInMonth(d.getUTCFullYear(), d.getUTCMonth());
    const lastDayOfPrevMonth = days[days.length - 1];
    const lastWeekday = lastDayOfPrevMonth.getUTCDay();
    const offset = -lastWeekday;
    if (offset === 0) {
      return [];
    }
    return days.slice(-lastWeekday);
  }

  private getDaysInNextMonth(): Date[] {
    const d = cloneDate(this._ref);
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
    const currentMonth = d.getUTCMonth();
    const days: Date[] = [];

    while(d.getUTCMonth() === currentMonth) {
      days.push(new Date(d.getTime()));
      d.setUTCDate(d.getUTCDate() + 1);
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
      const weekday = d.getUTCDay();

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
    d.setUTCDate(1);
    return d;
  }

  private getLastDayOfCurrentMonth(): Date {
    const d = cloneDate(this._ref);
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
