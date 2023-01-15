import { comparableDate, cloneDate, range as utilsRange } from '../utils';
import { PickerOptions, YearItem } from '../types';
import { Picker } from './picker';

const YEARS_COUNT = 12;

export class YearPicker extends Picker<YearItem> {
  constructor(ref?: Date | PickerOptions, options?: PickerOptions) {
    super(ref, options);
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

    // Fictous point in time
    // July 1st is half year so it's nice!
    const d = new Date(2022, 6, 1);

    // Init comparable values
    const now = this.comparable(new Date());
    const min = this.comparable(this?.min);
    const max = this.comparable(this?.max);
    const selected = this.comparable(this?.selected);
    const focused = this.comparable(this?.focused);
    const rangeStart = this.comparable(this?.range?.from);
    const rangeEnd = this.comparable(this?.range?.to);
    const isAnyRange = !!rangeStart && !!rangeEnd;

    const half = Math.floor(YEARS_COUNT / 2);
    const year = this._ref.getUTCFullYear();
    const inf = year - half + 1;
    const sup = year + half;

    return utilsRange(inf, sup).map(year => {
      d.setUTCFullYear(year);
      const item = this.comparable(d) as number;

      let isDisabled = false;
      if (min) isDisabled = item < min;
      if (max) isDisabled = item > max;

      return {
        id: year,
        label: `${year}`,
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
    return d ? comparableDate(d, 'year') : null;
  }
}
