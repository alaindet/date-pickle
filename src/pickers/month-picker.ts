import { comparableDate, range } from '../utils';
import { ItemsChangeHandler, Locale, MonthItem } from '../types';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker {

  private items!: MonthItem[];
  private locale!: Locale;
  private min?: Date;
  private max?: Date;
  private itemsChangeHandler?: ItemsChangeHandler<MonthItem>;

  constructor(locale = 'default', shouldUpdate = true) {
    this.locale = locale;
    shouldUpdate && this.updateItems();
  }

  getMin(): Date | undefined { return this.min }
  getMax(): Date | undefined { return this.max }
  getLocale(): Locale { return this.locale }
  getItems(): MonthItem[] { return this.items }

  setLocale(locale: string, shouldUpdate = true): void {
    this.locale = locale;
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

  onItemsChange(handler: ItemsChangeHandler<MonthItem>): void {
    this.itemsChangeHandler = handler;
    if (this.items) handler(this.items);
  }

  updateItems(): void {
    this.items = this.buildItems();
    this.itemsChangeHandler && this.itemsChangeHandler(this.items);
  }

  private buildItems(): MonthItem[] {

    const d = new Date();
    const thisMonthComp = comparableDate(d, 'month');
    const minComp = this.min ? comparableDate(this.min, 'month') : null;
    const maxComp = this.max ? comparableDate(this.max, 'month') : null;

    const inf = FIRST_MONTH_INDEX;
    const sup = LAST_MONTH_INDEX;

    return range(inf, sup).map(monthIndex => {

      d.setMonth(monthIndex);
      const monthComp = comparableDate(d, 'month');

      const name = d.toLocaleString(this.locale, { month: 'long'} ).toLocaleLowerCase();

      const isCurrent = monthComp === thisMonthComp;

      let isDisabled = false;
      if (minComp) isDisabled = monthComp < minComp;
      if (maxComp) isDisabled = monthComp > maxComp;

      return {
        number: monthIndex + 1,
        name,
        isCurrent,
        isDisabled,
      };
    });
  }
}
