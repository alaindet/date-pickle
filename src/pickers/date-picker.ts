import { comparableDate } from '../utils';
import { ItemsChangeHandler, DayItem } from '../types';

export class DatePicker {

  ref!: Date;
  items!: DayItem[];
  min?: Date;
  max?: Date;
  private itemsChangeHandler?: ItemsChangeHandler<DayItem>;

  /**
   * Shows some days of prev and next month to fill the week (starts on monday)
   *
   * Ex.:
   * - If first day of current month is wednesday, show prev month's last 2 days
   * - If last day of current month is thursday, show next months' first 3 days
   */
  private peek = true;

  constructor(current?: Date, shouldUpdate = true) {
    const d = current ?? new Date();
    this.ref = d;
    shouldUpdate && this.updateItems();
  }

  getMin(): Date | undefined { return this.min }
  getMax(): Date | undefined { return this.max }
  getItems(): DayItem[] { return this.items }

  onItemsChange(handler: ItemsChangeHandler<DayItem>): void {
    this.itemsChangeHandler = handler;
    if (this.items) handler(this.items);
  }

  setNow(shouldUpdate = true): void {
    this.setCurrent(new Date(), shouldUpdate);
  }

  setCurrent(current: Date, shouldUpdate = true): void {
    this.ref = current;
    shouldUpdate && this.updateItems();
  }

  setMin(min: Date, shouldUpdate = true): void {
    this.min = min;
    shouldUpdate && this.updateItems();
  }

  setMax(max: Date, shouldUpdate = true): void {
    this.max = max;
    shouldUpdate && this.updateItems();
  }

  setPeek(peek: boolean, shouldUpdate = true): void {
    this.peek = peek;
    shouldUpdate && this.updateItems();
  }

  next(shouldUpdate = true): void {
    this.ref.setDate(15);
    this.ref.setMonth(this.ref.getMonth() + 1);
    shouldUpdate && this.updateItems();
  }

  prev(shouldUpdate = true): void {
    this.ref.setDate(15);
    this.ref.setMonth(this.ref.getMonth() - 1);
    shouldUpdate && this.updateItems();
  }

  updateItems(): void {
    this.items = this.buildItems();
    this.itemsChangeHandler && this.itemsChangeHandler(this.items);
  }

  private buildItems(): DayItem[] {

    const days = this.getDaysInCurrentMonth();

    if (this.peek) {
      days.unshift(...this.getDaysInPreviousMonth());
      days.push(...this.getDaysInNextMonth());
    }

    return this.toCalendarDays(days);
  }

  private getDaysInCurrentMonth(): Date[] {
    return this.getDaysInMonth(this.ref.getFullYear(), this.ref.getMonth());
  }

  private getDaysInPreviousMonth(): Date[] {
    const d = new Date(this.ref.getTime());
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
    const d = new Date(this.ref.getTime());
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
    const d = new Date(this.ref.getTime());
    d.setDate(1);
    return d;
  }

  private getLastDayOfCurrentMonth(): Date {
    const d = new Date(this.ref.getTime());
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(d.getDate() - 1);
    return d;
  }

  private getAllowedDateRange(): [Date, Date] {
    let inf = this.getFirstDayOfCurrentMonth();
    let sup = this.getLastDayOfCurrentMonth();

    // Restrict range from bottom?
    if (this.min) {
      const minComparable = comparableDate(this.min, 'day');
      inf = minComparable > comparableDate(inf, 'day') ? this.min : inf;
    }

    // Restrict range from top?
    if (this.max) {
      const maxComparable = comparableDate(this.max, 'day');
      sup = maxComparable < comparableDate(sup, 'day') ? this.max : sup;
    }

    return [inf, sup];
  }
}
