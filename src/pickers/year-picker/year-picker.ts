import { range, cloneDate } from '../../utils';
import { PickerOptions, TIME_INTERVAL, YearItem } from '../../types';
import { Picker } from '../picker';

const YEARS_COUNT = 12;

export class YearPicker extends Picker<YearItem> {

  constructor(ref?: Date | PickerOptions, options?: PickerOptions) {
    super(ref, options);
    this._focusOffset = 3;
    this._interval = TIME_INTERVAL.YEAR;
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

    // Fictous point in time
    // July 1st is half year so it's nice!
    const d = new Date(2022, 6, 1);

    // Init comparable values;
    const nowComp = this.toComparable(new Date());
    const minComp = this.toComparable(this?.min);
    const maxComp = this.toComparable(this?.max);
    const selectedComp = this.toComparable(this?.selected);
    const focusedComp = this.toComparable(this?.focused);

    // TODO: Remove
    console.log('focusedComp', focusedComp);

    const half = Math.floor(YEARS_COUNT / 2);
    const year = this._ref.getUTCFullYear();
    const inf = year - half + 1;
    const sup = year + half;

    return range(inf, sup).map(year => {
      d.setUTCFullYear(year);
      const itemComp = this.toComparable(d)!;

      let isDisabled = false;
      if (minComp) isDisabled = itemComp < minComp;
      if (maxComp) isDisabled = itemComp > maxComp;

      return {
        id: year,
        label: `${year}`,
        date: cloneDate(d),
        isNow: itemComp === nowComp,
        isDisabled,
        isSelected: itemComp === selectedComp,
        isFocused: itemComp === focusedComp,
      };
    });
  }
}
