import { cloneDate, range } from '../../utils';
import { MonthItem, PickerOptions, TIME_INTERVAL } from '../../types';
import { Picker } from '../picker';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker extends Picker<MonthItem> {

  constructor(ref?: Date | PickerOptions, options?: PickerOptions) {
    super(ref, options);
    this._focusOffset = 3; // Jumps one season by default
    this._interval = TIME_INTERVAL.MONTH;
    this.updateItems();
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
    const nowComp = this.toComparable(new Date());
    const minComp = this.toComparable(this?.min);
    const maxComp = this.toComparable(this?.max);
    const selectedComp = this.toComparable(this?.selected);
    const focusedComp = this.toComparable(this?.focused);

    return range(FIRST_MONTH_INDEX, LAST_MONTH_INDEX).map(monthIndex => {
      d.setUTCMonth(monthIndex);

      const itemComp = this.toComparable(d)!;

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
}
