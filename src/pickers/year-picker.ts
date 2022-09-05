import { range, comparableDate } from '../utils';
import { PickerOptions, YearItem } from '../types';
import { Picker } from './picker';

const YEARS_COUNT = 12;

export class YearPicker extends Picker<YearItem> {
  constructor(current?: Date, options?: PickerOptions) {
    super(current, options);
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

    // Init comparable values;
    const nowComp = this.comparable(d);
    const minComp = this.comparable(this?.min);
    const maxComp = this.comparable(this?.max);
    const selectedComp = this.comparable(this?.selected);
    const focusedComp = this.comparable(this?.focused);

    const half = Math.floor(YEARS_COUNT / 2);
    const year = this._ref.getUTCFullYear();
    const inf = year - half + 1;
    const sup = year + half;

    return range(inf, sup).map(year => {
      d.setUTCFullYear(year);
      const itemComp = this.comparable(d) as number;

      let isDisabled = false;
      if (minComp) isDisabled = itemComp < minComp;
      if (maxComp) isDisabled = itemComp > maxComp;

      return {
        year,
        isNow: itemComp === nowComp,
        isDisabled,
        isSelected: itemComp === selectedComp,
        isFocused: itemComp === focusedComp,
      };
    });
  }

  private comparable(d?: Date): number | null {
    return d ? comparableDate(d, 'year') : null;
  }
}
