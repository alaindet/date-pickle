import { InvalidDateRangeError } from '../errors';
import { DatePickleEventHandler, DateRange, Locale, PickerOptions } from '../types';

export abstract class Picker<ItemType = unknown> {
  protected _ref!: Date;
  protected _items: ItemType[] = [];
  protected _min?: Date;
  protected _max?: Date;
  protected _locale = 'default';
  protected _selected?: Date;
  protected _focused?: Date;
  protected _range?: DateRange;
  protected _itemsChangeHandler?: DatePickleEventHandler<ItemType[]>;
  protected _selectedHandler?: DatePickleEventHandler<Date | undefined>;
  protected _focusedHandler?: DatePickleEventHandler<Date | undefined>;
  protected _sync = true;

  constructor(refOrOptions?: PickerOptions | Date, options?: PickerOptions) {
    // Ex.: new Picker()
    if (!refOrOptions) {
      this._ref = new Date();
      this.updateItems();
      return;
    }

    // Ex.: new Picker(new Date('2000-01-01'))
    if (refOrOptions instanceof Date) {
      this._ref = refOrOptions;
      options = options ?? {};
    }

    // Parse options
    if (options?.ref) this._ref = options.ref;
    if (options?.min) this._min = options.min;
    if (options?.max) this._max = options.max;
    if (options?.sync) this._sync = options.sync;
    if (options?.locale) this._locale = options.locale;
    if (options?.selected) this._selected = options.selected;
    if (options?.focused) this._focused = options.focused;
    if (this.validateRange(options?.range)) {
      this._range = options!.range as DateRange;
    }

    this.updateItems();
  }

  get ref(): Date {
    return this._ref;
  }

  set ref(ref: Date | null) {
    this._ref = ref ?? new Date();
    this.updateItems();
  }

  get sync(): boolean {
    return this._sync;
  }

  set sync(sync: boolean | null) {
    this._sync = !!sync;
    sync && this.updateItems();
  }

  get min(): Date | undefined {
    return this._min;
  }

  set min(min: Date | undefined | null) {
    if (min === null) min = undefined;
    this._min = min;
    this.updateItems();
  }

  get max(): Date | undefined {
    return this._max;
  }

  set max(max: Date | undefined | null) {
    if (max === null) max = undefined;
    this._max = max;
    this.updateItems();
  }

  get locale(): Locale {
    return this._locale;
  }

  set locale(locale: Locale) {
    this._locale = locale;
    this.updateItems();
  }

  get selected(): Date | undefined {
    return this._selected;
  }

  set selected(selected: Date | undefined | null) {
    if (selected === null) selected = undefined;
    this._selected = selected;
    this.updateItems();
    this._selectedHandler && this._selectedHandler(selected);
  }

  get focused(): Date | undefined {
    return this._focused;
  }

  set focused(focused: Date | undefined | null) {
    if (focused === null) focused = undefined;
    this._focused = focused;
    this.updateItems();
    this._focusedHandler && this._focusedHandler(focused);
  }

  get range(): DateRange | undefined {
    return this._range;
  }

  set range(range: Partial<DateRange> | undefined | null) {
    if (range === null) range = undefined;
    if (!this.validateRange(range)) {
      throw new InvalidDateRangeError('Invalid date range provided', range);
    }
    this._range = range as DateRange;
    this.updateItems();
  }

  get items(): ItemType[] | undefined {
    return this._items;
  }

  now(): void {
    this._ref = new Date();
    this.updateItems();
  }

  onItemsChange(handler: DatePickleEventHandler<ItemType[]>): void {
    this._itemsChangeHandler = handler;
    if (this.items && this._sync) handler(this.items);
  }

  onSelected(handler: DatePickleEventHandler<Date | undefined>): void {
    this._selectedHandler = handler;
    if (this._selected && this._sync) handler(this._selected);
  }

  onFocused(handler: DatePickleEventHandler<Date | undefined>): void {
    this._focusedHandler = handler;
    if (this._focused && this._sync) handler(this._focused);
  }

  updateItems(): void {
    if (!this._sync) return;
    this._items = this.buildItems();
    if (this._itemsChangeHandler) this._itemsChangeHandler(this._items);
  }

  // Overridden by child class
  protected buildItems(): ItemType[] {
    return [];
  }

  private validateRange(range?: PickerOptions['range']): boolean {
    if (!range) return false;
    if (!range.from || !range.to) return false;
    if (range.to.getTime() > range.from.getTime()) return false;
    return true;
  }
} 
