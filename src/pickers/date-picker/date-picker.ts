import { cloneDate, comparableDate } from '../../utils';
import { DayItem, PickerOptions } from '../../types';
import { Picker } from '../picker';

export class DatePicker extends Picker<DayItem> {

  constructor(ref?: Date | PickerOptions, options?: PickerOptions) {
    super(ref, options);
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

    // TODO: Manage peek property?
    const peek = true;

    if (peek) {
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
    const infComp = this.comparable(inf)!;
    const supComp = this.comparable(sup)!;

    const SUNDAY = 0;
    const SATURDAY = 6;
    const nowComp = this.comparable(new Date());
    const selectedComp = this.comparable(this?.selected);
    const focusedComp = this.comparable(this?.focused);

    return dates.map(d => {
      const itemComp = this.comparable(d)!;
      const weekday = d.getUTCDay();
      const day = d.getUTCDate();
      const month = d.getUTCMonth() + 1;
      const id = Number(`${month}${day}`);

      return {
        id,
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
      const minComp = this.comparable(this.min)!;
      inf = minComp > this.comparable(inf)! ? this._min! : inf;
    }

    // Restrict range from top?
    if (this._max) {
      const maxComp = this.comparable(this._max)!;
      sup = maxComp < this.comparable(sup)! ? this._max! : sup;
    }

    return [inf, sup];
  }

  private comparable(d?: Date): number | null {
    return d ? comparableDate(d, 'day') : null;
  }
}
