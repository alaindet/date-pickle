import { range, comparableDate, cloneDate } from '../../utils';
import { PickerOptions, YearItem } from '../../types';
import { Picker } from '../picker';

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

    // Init comparable values;
    const nowComp = this.comparable(new Date());
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

  private comparable(d?: Date): number | null {
    return d ? comparableDate(d, 'year') : null;
  }
}
