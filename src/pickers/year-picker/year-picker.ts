import { range, cloneDate, getUniqueYearId } from '../../utils';
import {
  PickerOptions,
  TIME_INTERVAL,
  YearItem,
  YearPickerStartWith,
  YEAR_PICKER_START_WITH,
} from '../../types';
import { BasePicker } from '../base-picker';

const YEARS_COUNT = 10;

export class YearPicker extends BasePicker<YearItem> {
  // TODO: Group into picker-specific props
  private startWithProp: YearPickerStartWith =
    YEAR_PICKER_START_WITH.FIRST_OF_DECADE;

  get startWith(): YearPickerStartWith {
    return this.startWithProp;
  }

  set startWith(startWith: YearPickerStartWith) {
    if (!Object.values(YEAR_PICKER_START_WITH).includes(startWith)) {
      throw new Error('invalid value for startWith property');
    }
    this.startWithProp = startWith;
    this.updateState();
  }

  constructor(cursor?: Date | PickerOptions, options?: PickerOptions) {
    super(cursor, options);
    this.props.focusOffset = 3;
    this.props.interval = TIME_INTERVAL.YEAR;
    this.updateState();
  }

  next(): void {
    const cursor = cloneDate(this._cursor);
    cursor.setUTCFullYear(cursor.getUTCFullYear() + YEARS_COUNT);
    this.cursor = cursor;
  }

  prev(): void {
    const cursor = cloneDate(this._cursor);
    cursor.setUTCFullYear(cursor.getUTCFullYear() - YEARS_COUNT);
    this.cursor = cursor;
  }

  private getYearsRange(): number[] {
    const year = this._cursor.getUTCFullYear(); // 2023
    const first = Math.floor(year / YEARS_COUNT) * YEARS_COUNT; // 2020
    const last = first + YEARS_COUNT; // 2030
    const yearsRange = range(first, last);

    switch (this.startWithProp) {
    case YEAR_PICKER_START_WITH.FIRST_OF_DECADE:
    case YEAR_PICKER_START_WITH.X0:
      return [...yearsRange, last + 1];
    case YEAR_PICKER_START_WITH.LAST_OF_PREVIOUS_DECADE:
    case YEAR_PICKER_START_WITH.X9:
      return [first - 1, ...yearsRange];
    }
  }

  protected buildItems(): YearItem[] {
    // Fictous point in time
    // July 1st is half year so it's nice!
    const y = this._cursor.getUTCFullYear();
    const d = new Date(Date.UTC(y, 6, 1));

    // Init comparable values
    const nowComp = this.toComparable(new Date());
    const minComp = this.toComparable(this.props?.min);
    const maxComp = this.toComparable(this.props?.max);
    const selectedComp = this.toComparable(this.props?.selected);
    const focusedComp = this.toComparable(this.props?.focused);

    return this.getYearsRange().map(year => {
      d.setUTCFullYear(year);
      const itemComp = this.toComparable(d)!;

      let isDisabled = false;
      if (minComp) isDisabled = itemComp < minComp;
      if (maxComp) isDisabled = itemComp > maxComp;

      return {
        id: getUniqueYearId(d),
        label: `${year}`,
        date: cloneDate(d),
        isNow: itemComp === nowComp,
        isDisabled,
        isSelected: itemComp === selectedComp,
        isFocused: itemComp === focusedComp,
      };
    });
  }

  // Ex.: "2020-2030"
  protected buildTitle(): string {
    const year = this._cursor.getUTCFullYear(); // 2023
    const first = Math.floor(year / YEARS_COUNT) * YEARS_COUNT; // 2020
    const last = first + YEARS_COUNT; // 2030
    return `${first}-${last}`;
  }
}
