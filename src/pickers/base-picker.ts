import { parsePickerInput, comparableDate, cloneDate, addTimeInterval, findLastIndex } from '../utils';
import { PickerEventHandler, Locale, PickerOptions, TimeInterval, BaseItem, PickerEventHadlers, PickerProperties, TIME_INTERVAL } from '../types';

export abstract class BasePicker<TItem extends BaseItem> {

  protected handlers: PickerEventHadlers<TItem> = {};
  // protected props: PickerProperties = {
  //   locale: 'default',
  //   focusOffset: 7, // Overridden by child
  //   interval: TIME_INTERVAL.DAY, // Overridden by child
  // };

  protected _cursor!: Date;
  protected _items: TItem[] = [];

  protected _min?: Date;
  protected _max?: Date;
  protected _locale = 'default';
  protected _selected?: Date;
  protected _focused?: Date;
  protected _focusOffset!: number; // Defined by child class
  protected _interval!: TimeInterval; // Defined by child class

  constructor(cursorOrOptions?: Date | PickerOptions, options?: PickerOptions) {
    const input = parsePickerInput(cursorOrOptions, options);
    this._cursor = input.cursor;
    this._cursor = input.options.cursor ?? this._cursor;
    this._min = input.options.min ?? this._min;
    this._max = input.options.max ?? this._max;
    this._locale = input.options.locale ?? this._locale;
    this._selected = input.options.selected ?? this._selected;
    this._focused = input.options.focused ?? this._focused;
    this._focusOffset = input.options.focusOffset ?? this._focusOffset;
  }

  get cursor(): Date {
    return this._cursor;
  }

  set cursor(cursor: Date | null) {
    this._cursor = cursor ?? new Date();
    this.updateItems();
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

    // Selected items MUST be on the page
    // This updates the whole page if needed
    if (this._selected) {
      this._cursor = cloneDate(selected as Date);
    }

    this.updateItems();
    if (this.handlers.selectedChange) this.handlers.selectedChange(selected);
  }

  get focused(): Date | undefined {
    return this._focused;
  }

  set focused(focused: Date | undefined | null) {
    if (focused === null) focused = undefined;
    this._focused = focused;

    // Focused items MUST be on the page
    // This updates the whole page if needed
    if (this._focused) {
      this._cursor = cloneDate(focused as Date);
    }

    this.updateItems();
    if (this.handlers.focusedChange) this.handlers.focusedChange(focused);
  }

  get focusOffset(): number {
    return this._focusOffset;
  }

  set focusOffset(focusOffset: number) {
    this._focusOffset = focusOffset;
  }

  get items(): TItem[] | undefined {
    return this._items;
  }

  updateAfter(fn: () => void): void {
    fn();
    this._items = this.buildItems();
    if (this.handlers.itemsChange) this.handlers.itemsChange(this._items);
  }

  now(): void {
    this.cursor = new Date();
  }

  onItemsChange(handler: PickerEventHandler<TItem[]>, immediate = false): void {
    this.handlers.itemsChange = handler;
    if (immediate) handler(this._items ?? []);
  }

  clearItemsChangeEventListener(): void {
    delete this.handlers.itemsChange;
  }

  onSelectedChange(handler: PickerEventHandler<Date | undefined>, immediate = false): void {
    this.handlers.selectedChange = handler;
    if (immediate) handler(this._selected);
  }

  clearSelectedChangeEventListener(): void {
    delete this.handlers.selectedChange;
  }

  onFocusedChange(handler: PickerEventHandler<Date | undefined>, immediate = false): void {
    this.handlers.focusedChange = handler;
    if (immediate) handler(this._focused);
  }

  clearFocusedChangeEventListener(): void {
    delete this.handlers.focusedChange;
  }

  updateItems(): void {
    this._items = this.buildItems();
    if (this.handlers.itemsChange) this.handlers.itemsChange(this._items);
  }

  focusItemByOffset(_offset: number): void {
    const offset = _offset ?? this._focusOffset;
    this.updateAfter(() => {
      this.initFocusedIfNeeded();
      this.focused = addTimeInterval(this.focused!, offset, this._interval);
    });
  }

  focusItemByIndex(index?: number): void {
    if (index === undefined || index < 0 || index > this._items.length - 1) {
      throw new Error('invalid index');
    }
    if (index === -1) {
      throw new Error('no valid items');
    }
    this.updateAfter(() => {
      this.initFocusedIfNeeded();
      this.focused = cloneDate(this._items[index].date);
    });
  }

  focusPreviousItem(): void {
    this.focusItemByOffset(-1);
  }

  focusNextItem(): void {
    this.focusItemByOffset(1);
  }

  focusPreviousItemByOffset(_offset?: number): void {
    const offset = _offset ?? this._focusOffset;
    this.focusItemByOffset(-1 * offset);
  }

  focusNextItemByOffset(_offset?: number): void {
    this.focusItemByOffset(_offset ?? this._focusOffset);
  }

  focusFirstItemOfPage(): void {
    this.focusItemByIndex(this._items.findIndex(item => !item.isDisabled));
  }

  focusLastItemOfPage(): void {
    this.focusItemByIndex(findLastIndex(this._items, item => !item.isDisabled));
  }

  private initFocusedIfNeeded(): void {

    if (this._focused) {
      return;
    }

    if (this._selected) {
      this._focused = cloneDate(this._selected);
      return;
    }

    this._focused = cloneDate(this._cursor);
  }

  // Overridden by child class
  protected buildItems(): TItem[] {
    return [];
  }

  protected toComparable(d?: Date | null): number | null {
    return d ? comparableDate(d, this._interval) : null;
  }
}
