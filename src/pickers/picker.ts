import { ItemsChangeHandler, Locale, PickerOptions } from '../types';

export abstract class Picker<ItemType = unknown> {

  protected _ref!: Date;
  protected _items: ItemType[] = [];
  protected _min?: Date;
  protected _max?: Date;
  protected _locale = 'default';
  protected _selected?: Date;
  protected _focused?: Date;
  protected _itemsChangeHandler?: ItemsChangeHandler<ItemType>;
  protected _shouldUpdate = true;

  constructor(current?: Date, options?: PickerOptions) {
    this._ref = current ?? new Date();
    if (options?.min) this._min = options.min;
    if (options?.max) this._max = options.max;
    if (options?.shouldUpdate) this._shouldUpdate = options.shouldUpdate;
    if (options?.locale) this._locale = options.locale;
    if (options?.selected) this._selected = options.selected;
    if (options?.focused) this._focused = options.focused;
    this.updateItems();
  }

  get current(): Date {
    return this._ref;
  }

  set current(current: Date) {
    this._ref = current;
    this.updateItems();
  }

  get shouldUpdate(): boolean {
    return this._shouldUpdate;
  }

  set shouldUpdate(shouldUpdate: boolean) {
    this._shouldUpdate = shouldUpdate;
    shouldUpdate && this.updateItems();
  }

  get min(): Date | undefined {
    return this._min;
  }

  set min(min: Date | undefined) {
    this._min = min;
    this.updateItems();
  }

  get max(): Date | undefined {
    return this._max;
  }

  set max(max: Date | undefined) {
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

  set selected(selected: Date | undefined) {
    this._selected = selected;
    this.updateItems();
  }

  get focused(): Date | undefined {
    return this._focused;
  }

  set focused(focused: Date | undefined) {
    this._focused = focused;
    this.updateItems();
  }

  get items(): ItemType[] | undefined {
    return this._items;
  }

  now(): void {
    this._ref = new Date();
    this.updateItems();
  }

  onItemsChange(handler: ItemsChangeHandler<ItemType>): void {
    this._itemsChangeHandler = handler;
    if (this.items && this._shouldUpdate) handler(this.items);
  }

  updateItems(): void {
    if (!this._shouldUpdate) return;
    this._items = this.buildItems();
    this._itemsChangeHandler && this._itemsChangeHandler(this._items);
  }

  // Overridden by child class
  protected buildItems(): ItemType[] {
    return [];
  }
}
