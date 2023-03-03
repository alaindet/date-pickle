import { cloneDate, getUniqueMonthId, range } from '../../utils';
import { MonthItem, PickerOptions, TIME_INTERVAL } from '../../types';
import { BasePicker } from '../base-picker';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker extends BasePicker<MonthItem> {
  constructor(cursor?: Date | PickerOptions, options?: PickerOptions) {
    super(cursor, options);
    this.props.focusOffset = 3; // Jumps one season by default
    this.props.interval = TIME_INTERVAL.MONTH;
    this.updateState();
  }

  next(): void {
    const cursor = cloneDate(this._cursor);
    cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
    this.cursor = cursor;
  }

  prev(): void {
    const cursor = cloneDate(this._cursor);
    cursor.setUTCFullYear(cursor.getUTCFullYear() - 1);
    this.cursor = cursor;
  }

  protected buildItems(): MonthItem[] {
    // Fictious point in time
    // July 1st is half year so it's nice!
    const year = this._cursor.getUTCFullYear();
    const d = new Date(Date.UTC(year, 6, 1));

    // Init comparable values
    const nowComp = this.toComparable(new Date());
    const minComp = this.toComparable(this.props?.min);
    const maxComp = this.toComparable(this.props?.max);
    const selectedComp = this.toComparable(this.props?.selected);
    const focusedComp = this.toComparable(this.props?.focused);

    return range(FIRST_MONTH_INDEX, LAST_MONTH_INDEX).map(monthIndex => {
      d.setUTCMonth(monthIndex);

      const itemComp = this.toComparable(d)!;

      const label = d
        .toLocaleString(this.props.locale, { month: 'long' })
        .toLocaleLowerCase();

      let isDisabled = false;
      if (minComp) isDisabled = itemComp < minComp;
      if (maxComp) isDisabled = itemComp > maxComp;

      return {
        id: getUniqueMonthId(d),
        label,
        date: cloneDate(d),
        isNow: itemComp === nowComp,
        isDisabled,
        isSelected: itemComp === selectedComp,
        isFocused: itemComp === focusedComp,
      };
    });
  }

  // Ex.: "2023"
  protected buildTitle(): string {
    const someMonthInTheYear = Math.floor(this._items.length / 2);
    const d = this._items[someMonthInTheYear].date;
    const year = d.getFullYear();
    return `${year}`;
  }
}
