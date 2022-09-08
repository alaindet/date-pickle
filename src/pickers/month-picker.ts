import { comparableDate, range } from '../utils';
import { MonthItem, PickerOptions } from '../types';
import { Picker } from './picker';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker extends Picker<MonthItem> {
  constructor(ref?: Date, options?: PickerOptions) {
    super(ref, options);
  }

  next(): void {
    this._ref.setUTCFullYear(this._ref.getUTCFullYear() + 1);
    this.updateItems();
  }

  prev(): void {
    this._ref.setUTCFullYear(this._ref.getUTCFullYear() - 1);
    this.updateItems();
  }

  protected buildItems(): MonthItem[] {
    const d = new Date();

    // Init comparable values
    const nowComp = this.comparable(d);
    const minComp = this.comparable(this?.min);
    const maxComp = this.comparable(this?.max);
    const selectedComp = this.comparable(this?.selected);
    const focusedComp = this.comparable(this?.focused);

    return range(FIRST_MONTH_INDEX, LAST_MONTH_INDEX).map(monthIndex => {
      d.setUTCMonth(monthIndex);

      const itemComp = this.comparable(d) as number;

      const name = d
        .toLocaleString(this._locale, { month: 'long' })
        .toLocaleLowerCase();

      let isDisabled = false;
      if (minComp) isDisabled = itemComp < minComp;
      if (maxComp) isDisabled = itemComp > maxComp;

      return {
        number: monthIndex + 1,
        name,
        isNow: itemComp === nowComp,
        isDisabled,
        isSelected: itemComp === selectedComp,
        isFocused: itemComp === focusedComp,
      };
    });
  }

  private comparable(d?: Date): number | null {
    return d ? comparableDate(d, 'month') : null;
  }
}
