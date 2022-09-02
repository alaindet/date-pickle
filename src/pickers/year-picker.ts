import { range, comparableDate } from '../utils';
import { ItemsChangeHandler, YearItem } from '../types';

export class YearPicker {

  private ref!: Date;
  private items!: YearItem[];
  private itemsCount = 12;
  private min?: Date;
  private max?: Date;
  private itemsChangeHandler?: ItemsChangeHandler<YearItem>;

  constructor(current?: Date, shouldUpdate = true) {
    this.ref = current ?? new Date();
    shouldUpdate && this.updateItems();
  }

  getMin(): Date | undefined { return this.min }
  getMax(): Date | undefined { return this.max }
  getItems(): YearItem[] { return this.items }

  setNow(shouldUpdate = true): void {
    this.ref = new Date();
    shouldUpdate && this.updateItems();
  }

  setYear(year: number, shouldUpdate = true): void {
    this.ref.setFullYear(year);
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

  onItemsChange(handler: ItemsChangeHandler<YearItem>): void {
    this.itemsChangeHandler = handler;
    if (this.items) handler(this.items);
  }

  next(shouldUpdate = true): void {
    this.ref.setFullYear(this.ref.getFullYear() + this.itemsCount);
    shouldUpdate && this.updateItems();
  }

  prev(shouldUpdate = true): void {
    this.ref.setFullYear(this.ref.getFullYear() - this.itemsCount);
    shouldUpdate && this.updateItems();
  }

  updateItems(): void {
    this.items = this.buildItems();
    this.itemsChangeHandler && this.itemsChangeHandler(this.items);
  }

  private buildItems(): YearItem[] {

    const d = new Date();
    const thisYearComp = d.getFullYear();
    const minComp = this.min ? comparableDate(this.min, 'year') : null;
    const maxComp = this.max ? comparableDate(this.max, 'year') : null;

    const half = Math.floor(this.itemsCount / 2);
    const year = this.ref.getFullYear();
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
