import { parsePickerInput, comparableDate } from '../utils';
import { PickerEventHandler, Locale, PickerOptions, TimeInterval } from '../types';

export abstract class Picker<ItemType = unknown> {

  protected _ref!: Date;
  protected _items: ItemType[] = [];
  protected _min?: Date;
  protected _max?: Date;
  protected _locale = 'default';
  protected _itemsChangeHandler?: PickerEventHandler<ItemType[]>;
  protected _sync = true;

  protected _selected?: Date;
  protected _selectedHandler?: PickerEventHandler<Date | undefined>;

  protected _focused?: Date;
  protected _focusOffset!: number; // Defined by child class
  protected _focusedHandler?: PickerEventHandler<Date | undefined>;
  protected _interval!: TimeInterval; // Defined by child class

  constructor(refOrOptions?: PickerOptions | Date, options?: PickerOptions) {
    const input = parsePickerInput(refOrOptions, options);
    this._ref = input.ref;
    this._ref = input.options.ref ?? this._ref;
    this._min = input.options.min ?? this._min;
    this._max = input.options.max ?? this._max;
    this._locale = input.options.locale ?? this._locale;
    this._selected = input.options.selected ?? this._selected;
    this._focused = input.options.focused ?? this._focused;
    this._focusOffset = input.options.focusOffset ?? this._focusOffset;
    this._sync = input.options.sync ?? this._sync;
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

  get items(): ItemType[] | undefined {
    return this._items;
  }

  now(): void {
    this._ref = new Date();
    this.updateItems();
  }

  onItemsChange(handler: PickerEventHandler<ItemType[]>): void {
    this._itemsChangeHandler = handler;
    if (this.items && this._sync) handler(this.items);
  }

  onSelected(handler: PickerEventHandler<Date | undefined>): void {
    this._selectedHandler = handler;
    if (this._selected && this._sync) handler(this._selected);
  }

  onFocused(handler: PickerEventHandler<Date | undefined>): void {
    this._focusedHandler = handler;
    if (this._focused && this._sync) handler(this._focused);
  }

  updateItems(): void {
    if (!this._sync) return;
    this._items = this.buildItems();
    this._itemsChangeHandler && this._itemsChangeHandler(this._items);
  }

  // Overridden by child class
  protected buildItems(): ItemType[] {
    return [];
  }

  protected toComparable(d?: Date | null): number | null {
    return d ? comparableDate(d, this._interval) : null;
  }
}
