import { cloneDate, comparableDate, range as utilsRange } from '../utils';
import { MonthItem, PickerOptions } from '../types';
import { Picker } from './picker';

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
    // Fictous point in time
    // July 1st is half year so it's nice!
    const d = new Date(Date.UTC(2022, 6, 1));

    // Init comparable values
    const now = this.comparable(new Date());
    const min = this.comparable(this?.min);
    const max = this.comparable(this?.max);
    const selected = this.comparable(this?.selected);
    const focused = this.comparable(this?.focused);
    const rangeStart = this.comparable(this?.range?.from);
    const rangeEnd = this.comparable(this?.range?.to);
    const isAnyRange = !!rangeStart && !!rangeEnd;

    return utilsRange(FIRST_MONTH_INDEX, LAST_MONTH_INDEX).map(monthIndex => {
      d.setUTCMonth(monthIndex);

      const item = this.comparable(d) as number;

      const label = d
        .toLocaleString(this._locale, { month: 'long' })
        .toLocaleLowerCase();

      let isDisabled = false;
      if (min) isDisabled = item < min;
      if (max) isDisabled = item > max;

      return {
        id: monthIndex + 1,
        label,
        date: cloneDate(d),
        isNow: item === now,
        isDisabled,
        isSelected: item === selected,
        isFocused: item === focused,
        inRange: isAnyRange && rangeStart <= item && item <= rangeEnd,
        isRangeStart: item === rangeStart,
        isRangeEnd: item === rangeEnd,
      };
    });
  }

  private comparable(d?: Date): number | null {
    return d ? comparableDate(d, 'month') : null;
  }
}
