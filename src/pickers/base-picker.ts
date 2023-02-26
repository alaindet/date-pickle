import {
  parsePickerInput,
  comparableDate,
  cloneDate,
  addTimeInterval,
  findLastIndex,
} from '../utils';
import {
  PickerEventHandler,
  Locale,
  PickerOptions,
  BaseItem,
  PickerEventHadlers,
  PickerProperties,
  TIME_INTERVAL,
} from '../types';

export abstract class BasePicker<TItem extends BaseItem> {
  protected handlers: PickerEventHadlers<TItem> = {};
  protected props: PickerProperties = {
    locale: 'default',
    focusOffset: 7, // Overridden by child
    interval: TIME_INTERVAL.DAY, // Overridden by child
  };

  protected _cursor!: Date;
  protected _items: TItem[] = [];

  constructor(cursorOrOptions?: Date | PickerOptions, options?: PickerOptions) {
    const input = parsePickerInput(cursorOrOptions, options);
    this._cursor = input.cursor;
    this._cursor = input.options.cursor ?? this._cursor;
    this.props.min = input.options.min ?? this.props.min;
    this.props.max = input.options.max ?? this.props.max;
    this.props.locale = input.options.locale ?? this.props.locale;
    this.props.selected = input.options.selected ?? this.props.selected;
    this.props.focused = input.options.focused ?? this.props.focused;
    this.props.focusOffset =
      input.options.focusOffset ?? this.props.focusOffset;
  }

  get cursor(): Date {
    return this._cursor;
  }

  set cursor(cursor: Date) {
    this._cursor = cursor;
    this.updateItems();
  }

  get min(): Date | undefined {
    return this.props.min;
  }

  set min(min: Date | undefined | null) {
    if (min === null) min = undefined;
    this.props.min = min;
    this.updateItems();
  }

  get max(): Date | undefined {
    return this.props.max;
  }

  set max(max: Date | undefined | null) {
    if (max === null) max = undefined;
    this.props.max = max;
    this.updateItems();
  }

  get locale(): Locale {
    return this.props.locale;
  }

  set locale(locale: Locale) {
    this.props.locale = locale;
    this.updateItems();
  }

  get selected(): Date | undefined {
    return this.props.selected;
  }

  set selected(selected: Date | undefined | null) {
    if (selected === null) selected = undefined;
    this.props.selected = selected;

    // Selected items MUST be on the page
    // This updates the whole page if needed
    if (this.props.selected) {
      this._cursor = cloneDate(selected as Date);
    }

    this.updateItems();
    if (this.handlers.selectedChange) this.handlers.selectedChange(selected);
  }

  get focused(): Date | undefined {
    return this.props.focused;
  }

  set focused(focused: Date | undefined | null) {
    if (focused === null) focused = undefined;
    this.props.focused = focused;

    // Focused items MUST be on the page
    // This updates the whole page if needed
    if (this.props.focused) {
      this._cursor = cloneDate(focused as Date);
    }

    this.updateItems();
    if (this.handlers.focusedChange) this.handlers.focusedChange(focused);
  }

  get focusOffset(): number {
    return this.props.focusOffset;
  }

  set focusOffset(focusOffset: number) {
    this.props.focusOffset = focusOffset;
  }

  get items(): TItem[] {
    return this._items ?? [];
  }

  updateAfter(fn: () => void): void {
    fn();
    this._items = this.buildItems();
    if (this.handlers.itemsChange) this.handlers.itemsChange(this._items ?? []);
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

  onSelectedChange(
    handler: PickerEventHandler<Date | undefined>,
    immediate = false
  ): void {
    this.handlers.selectedChange = handler;
    if (immediate) handler(this.props.selected);
  }

  clearSelectedChangeEventListener(): void {
    delete this.handlers.selectedChange;
  }

  onFocusedChange(
    handler: PickerEventHandler<Date | undefined>,
    immediate = false
  ): void {
    this.handlers.focusedChange = handler;
    if (immediate) handler(this.props.focused);
  }

  clearFocusedChangeEventListener(): void {
    delete this.handlers.focusedChange;
  }

  protected updateItems(): void {
    this._items = this.buildItems();
    if (this.handlers.itemsChange) this.handlers.itemsChange(this._items ?? []);
  }

  focusItemByOffset(_offset: number): void {
    const offset = _offset ?? this.props.focusOffset;
    this.updateAfter(() => {
      this.initFocusedIfNeeded();
      this.focused = addTimeInterval(
        this.focused!,
        offset,
        this.props.interval
      );
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
    const offset = _offset ?? this.props.focusOffset;
    this.focusItemByOffset(-1 * offset);
  }

  focusNextItemByOffset(_offset?: number): void {
    this.focusItemByOffset(_offset ?? this.props.focusOffset);
  }

  focusFirstItemOfPage(): void {
    this.focusItemByIndex(this._items.findIndex(item => !item.isDisabled));
  }

  focusLastItemOfPage(): void {
    this.focusItemByIndex(findLastIndex(this._items, item => !item.isDisabled));
  }

  private initFocusedIfNeeded(): void {
    if (this.props.focused) {
      return;
    }

    if (this.props.selected) {
      this.props.focused = cloneDate(this.props.selected);
      return;
    }

    this.props.focused = cloneDate(this._cursor);
  }

  // Overridden by child class
  next(): void {
    // Go to next page
  }

  // Overridden by child class
  prev(): void {
    // Go to next page
  }

  // Overridden by child class
  protected buildItems(): TItem[] {
    return [];
  }

  protected toComparable(d?: Date | null): number | null {
    return d ? comparableDate(d, this.props.interval) : null;
  }
}
