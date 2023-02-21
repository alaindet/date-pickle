import { cloneDate, comparableDate, range } from '../../utils';
import { MonthItem, PickerOptions } from '../../types';
import { Picker } from '../picker';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker extends Picker<MonthItem> {
  constructor(ref?: Date | PickerOptions, options?: PickerOptions) {
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

    // Fictious point in time
    // July 1st is half year so it's nice!
    const year = this._ref.getUTCFullYear();
    const d = new Date(Date.UTC(year, 6, 1));

    // Init comparable values
    const nowComp = this.comparable(new Date());
    const minComp = this.comparable(this?.min);
    const maxComp = this.comparable(this?.max);
    const selectedComp = this.comparable(this?.selected);
    const focusedComp = this.comparable(this?.focused);

    return range(FIRST_MONTH_INDEX, LAST_MONTH_INDEX).map(monthIndex => {
      d.setUTCMonth(monthIndex);

      const itemComp = this.comparable(d) as number;

      const label = d
        .toLocaleString(this._locale, { month: 'long' })
        .toLocaleLowerCase();

      let isDisabled = false;
      if (minComp) isDisabled = itemComp < minComp;
      if (maxComp) isDisabled = itemComp > maxComp;

      return {
        id: monthIndex + 1,
        label,
        date: cloneDate(d),
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
