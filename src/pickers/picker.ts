import { ItemsChangeHandler } from '../types';

export abstract class Picker<T = any> {

  protected _ref!: Date;
  protected _items!: T[];
  protected _min?: Date;
  protected _max?: Date;
  protected _itemsChangeHandler?: ItemsChangeHandler<T>;
  protected _shouldUpdate: boolean = true;

  constructor(current?: Date, shouldUpdate = true) {
    this._ref = current ?? new Date();
    this._shouldUpdate = shouldUpdate;
    this.updateItems();
  }

  get min(): Date | undefined { return this._min }
  get max(): Date | undefined { return this._max }
  get shouldUpdate(): boolean { return this._shouldUpdate }
  get items(): T[] | undefined { return this._items }

  set shouldUpdate(shouldUpdate: boolean) {
    this._shouldUpdate = shouldUpdate;
    shouldUpdate && this.updateItems();
  }

  set min(min: Date | undefined) {
    this._min = min;
    this.updateItems();
  }

  set max(max: Date | undefined) {
    this._max = max;
    this.updateItems();
  }

  now(): void {
    this._ref = new Date();
    this.updateItems();
  }

  onItemsChange(handler: ItemsChangeHandler<T>): void {
    this._itemsChangeHandler = handler;
    if (this.items && this._shouldUpdate) handler(this.items);
  }

  updateItems(): void {
    if (!this._shouldUpdate) return;
    this._items = this.buildItems();
    this._itemsChangeHandler && this._itemsChangeHandler(this._items);
  }

  // Overridden by child class
  protected buildItems(): T[] {
    return [];
  }
}
