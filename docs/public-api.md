# Date Pickle Public API

## Pickers

### `BasePicker`

```ts
abstract class BasePicker<TItem extends BaseItem> {

  constructor(
    cursorOrOptions?: Date | PickerOptions,
    options?: PickerOptions,
  );

  // State
  get items(): TItem[];

  // Properties
  get cursor(): Date;
  set cursor(cursor: Date | null);

  get min(): Date | undefined;
  set min(min: Date | undefined | null);

  get max(): Date | undefined;
  set max(max: Date | undefined | null);

  get locale(): Locale;
  set locale(locale: Locale);

  get selected(): Date | undefined;
  set selected(selected: Date | undefined | null);

  get focused(): Date | undefined;
  set focused(focused: Date | undefined | null);

  get focusOffset(): number;
  set focusOffset(focusOffset: number);

  // Events
  onItemsChange(
    handler: PickerEventHandler<TItem[]>,
    immediate?: boolean,
  ): void;
  clearItemsChangeEventListener(): void;

  onSelectedChange(
    handler: PickerEventHandler<Date | undefined>,
    immediate?: boolean,
  ): void;
  clearSelectedChangeEventListener(): void;

  onFocusedChange(
    handler: PickerEventHandler<Date | undefined>,
    immediate?: boolean,
  ): void;
  clearFocusedChangeEventListener(): void;

  // Core
  now(): void;
  next(): void;
  prev(): void;
  updateAfter(fn: () => void): void;

  // Focus management
  focusItemByOffset(offset: number): void;
  focusItemByIndex(index?: number): void;
  focusPreviousItem(): void;
  focusNextItem(): void;
  focusPreviousItemByOffset(offset?: number): void;
  focusNextItemByOffset(offset?: number): void;
  focusFirstItemOfPage(): void;
  focusLastItemOfPage(): void;
}
```

### `DatePicker`

```ts
class DatePicker extends BasePicker<DayItem> {
  // Same as BasePicker...
}
```

### `MonthPicker`

```ts
class MonthPicker extends BasePicker<MonthItem> {
  // Same as BasePicker...
}
```

### `YearPicker`

```ts
class YearPicker extends BasePicker<YearItem> {
  // Same as BasePicker...
  get startWith(): YearPickerStartWith;
  set startWith(startWith: YearPickerStartWith);
}
```

## Utilities

### Dates

#### `comparableDate`
This is the core of Date Pickle

```ts
comparableDate(
  date: Date | undefined | null,
  precision: TimeInterval,
): number | null;
```

#### `cloneDate`
```ts
function cloneDate(d: Date): Date;
```

#### `addTimeInterval`
```ts
function addTimeInterval(
  date: Date,
  amount: number,
  interval: TimeInterval,
): Date;
```

#### `getUniqueYearId`
```ts
function getUniqueYearId(date: Date): number;
```

#### `getUniqueMonthId`
```ts
function getUniqueMonthId(date: Date): number;
```

#### `getUniqueDayId`
```ts
function getUniqueDayId(date: Date): number;
```

### Common

#### `findLastIndex`
```ts
function findLastIndex<T = any>(arr: T[], fn: (item: T) => boolean): number;
```

#### `isInstanceOf`
```ts
type Constructor<T> = new (...args: any[]) => T;
function isInstanceOf(obj: any, classType: Constructor<any>): boolean;
```

#### `padStart`
```ts
function padStart(n: number, fill: string, len: number): string;
```

#### `range`
```ts
function range(fromOrTo: number, to?: number): number[];
```
