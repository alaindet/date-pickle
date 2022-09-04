import { comparableDate, range } from '../utils';
import { MonthItem } from '../types';
import { Picker } from './picker';

const FIRST_MONTH_INDEX = 0;
const LAST_MONTH_INDEX = 11;

export class MonthPicker extends Picker<MonthItem> {
  constructor(locale = 'default', shouldUpdate = true) {
    super(new Date(), false);
    this._locale = locale;
    this._shouldUpdate = shouldUpdate;
    this.updateItems();
  }

  protected buildItems(): MonthItem[] {
    const d = new Date();
    const thisMonthComp = comparableDate(d, 'month');
    const minComp = this._min ? comparableDate(this._min!, 'month') : null;
    const maxComp = this._max ? comparableDate(this._max!, 'month') : null;

    return range(FIRST_MONTH_INDEX, LAST_MONTH_INDEX).map(monthIndex => {
      d.setUTCMonth(monthIndex);
      const monthComp = comparableDate(d, 'month');

      const name = d
        .toLocaleString(this._locale, { month: 'long' })
        .toLocaleLowerCase();

      const isCurrent = monthComp === thisMonthComp;

      let isDisabled = false;
      if (minComp) isDisabled = monthComp < minComp;
      if (maxComp) isDisabled = monthComp > maxComp;

      return {
        number: monthIndex + 1,
        name,
        isCurrent,
        isDisabled,
      };
    });
  }
}
