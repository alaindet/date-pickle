import { comparableDate, range } from '../utils';
import { ItemsChangeHandler, Locale, MonthItem } from '../types';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker {

  private _items!: MonthItem[];
  private _locale!: Locale;
  private _min?: Date;
  private _max?: Date;
  private _itemsChangeHandler?: ItemsChangeHandler<MonthItem>;
  private _shouldUpdate: boolean = true;

  constructor(locale = 'default', shouldUpdate = true) {
    this._locale = locale;
    this._shouldUpdate = shouldUpdate;
    this.updateItems();
  }

  get locale(): Locale { return this._locale }
  get min(): Date | undefined { return this._min }
  get max(): Date | undefined { return this._max }
  get shouldUpdate(): boolean { return this._shouldUpdate }
  get items(): MonthItem[] | undefined { return this._items }

  set shouldUpdate(shouldUpdate: boolean) {
    this._shouldUpdate = shouldUpdate;
    shouldUpdate && this.updateItems();
  }

  set locale(locale: Locale) {
    this._locale = locale;
    this.updateItems();
  }

  set min(min: Date | undefined) {
    this._min = min;
    this.updateItems();
  }

  set max(max: Date | undefined) {
    this._max = max;
    this.updateItems();
  }

  onItemsChange(handler: ItemsChangeHandler<MonthItem>): void {
    this._itemsChangeHandler = handler;
    if (this._items) handler(this._items);
  }

  updateItems(): void {
    if (!this._shouldUpdate) return;
    this._items = this.buildItems();
    this._itemsChangeHandler && this._itemsChangeHandler(this._items);
  }

  private buildItems(): MonthItem[] {

    const d = new Date();
    const thisMonthComp = comparableDate(d, 'month');
    const minComp = this._min ? comparableDate(this._min!, 'month') : null;
    const maxComp = this._max ? comparableDate(this._max!, 'month') : null;

    const inf = FIRST_MONTH_INDEX;
    const sup = LAST_MONTH_INDEX;

    return range(inf, sup).map(monthIndex => {

      d.setMonth(monthIndex);
      const monthComp = comparableDate(d, 'month');

      const name = d.toLocaleString(this._locale, { month: 'long'} ).toLocaleLowerCase();

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
