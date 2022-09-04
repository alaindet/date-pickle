import { range, comparableDate } from '../utils';
import { YearItem } from '../types';
import { Picker } from './picker';

const YEARS_COUNT = 12;

export class YearPicker extends Picker<YearItem> {
  constructor(current?: Date, shouldUpdate = true) {
    super(current, shouldUpdate);
  }

  get year(): number {
    return this._ref.getUTCFullYear();
  }

  set year(year: number) {
    this._ref.setUTCFullYear(year);
    this.updateItems();
  }

  next(): void {
    this._ref.setUTCFullYear(this._ref.getUTCFullYear() + YEARS_COUNT);
    this.updateItems();
  }

  prev(): void {
    this._ref.setUTCFullYear(this._ref.getUTCFullYear() - YEARS_COUNT);
    this.updateItems();
  }

  protected buildItems(): YearItem[] {
    const d = new Date();
    const thisYearComp = d.getUTCFullYear();
    const minComp = this?.min ? comparableDate(this._min!, 'year') : null;
    const maxComp = this?.max ? comparableDate(this._max!, 'year') : null;

    const half = Math.floor(YEARS_COUNT / 2);
    const year = this._ref.getUTCFullYear();
    const inf = year - half + 1;
    const sup = year + half;

    return range(inf, sup).map(year => {
      d.setUTCFullYear(year);
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
