import { range, comparableDate } from '../utils';
import { YearItem } from '../types';
import { Picker } from './picker';

export class YearPicker extends Picker<YearItem> {

  private _itemsCount = 12;

  constructor(current?: Date, shouldUpdate = true) {
    super(current, shouldUpdate);
    this._ref = current ?? new Date();
  }

  set year(year: number) {
    this._ref.setFullYear(year);
    this.updateItems();
  }

  next(): void {
    this._ref.setFullYear(this._ref.getFullYear() + this._itemsCount);
    this.updateItems();
  }

  prev(): void {
    this._ref.setFullYear(this._ref.getFullYear() - this._itemsCount);
    this.updateItems();
  }

  protected override buildItems(): YearItem[] {

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
