import { range, comparableDate } from '../utils';
import { ItemsChangeHandler, YearItem } from '../types';

export class YearPicker {

  private _ref!: Date;
  private _items!: YearItem[];
  private _itemsCount = 12;
  private _min?: Date;
  private _max?: Date;
  private _itemsChangeHandler?: ItemsChangeHandler<YearItem>;
  private _shouldUpdate: boolean = true;

  constructor(current?: Date, shouldUpdate = true) {
    this._ref = current ?? new Date();
    this._shouldUpdate = shouldUpdate;
    this.updateItems();
  }

  get min(): Date | undefined { return this._min }
  get max(): Date | undefined { return this._max }
  get shouldUpdate(): boolean { return this._shouldUpdate }
  get items(): YearItem[] | undefined { return this._items }

  set shouldUpdate(shouldUpdate: boolean) {
    this._shouldUpdate = shouldUpdate;
    shouldUpdate && this.updateItems();
  }

  set year(year: number) {
    this._ref.setFullYear(year);
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

  now(): void {
    this._ref = new Date();
    this.updateItems();
  }

  onItemsChange(handler: ItemsChangeHandler<YearItem>): void {
    this._itemsChangeHandler = handler;
    if (this.items && this._shouldUpdate) handler(this.items);
  }

  next(): void {
    this._ref.setFullYear(this._ref.getFullYear() + this._itemsCount);
    this.updateItems();
  }

  prev(shouldUpdate = true): void {
    this._ref.setFullYear(this._ref.getFullYear() - this._itemsCount);
    this.updateItems();
  }

  updateItems(): void {
    if (!this._shouldUpdate) return;
    this._items = this.buildItems();
    this._itemsChangeHandler && this._itemsChangeHandler(this._items);
  }

  private buildItems(): YearItem[] {

    const d = new Date();
    const thisYearComp = d.getFullYear();
    const minComp = this?.min ? comparableDate(this._min!, 'year') : null;
    const maxComp = this?.max ? comparableDate(this._max!, 'year') : null;

    const half = Math.floor(this._itemsCount / 2);
    const year = this._ref.getFullYear();
    const inf = year - half + 1;
    const sup = year + half;

    return range(inf, sup).map(year => {

      d.setFullYear(year);
      const yearComp = comparableDate(d, 'year');

      const isCurrent = yearComp === thisYearComp;

      let isDisabled = false;
      if (minComp) isDisabled = yearComp < minComp;
      if (maxComp) isDisabled = yearComp > maxComp;

      return {
        year,
        isCurrent,
        isDisabled,
      };
    });
  }
}
