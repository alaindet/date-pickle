# Date Pickle

## Introduction

- At the core of Date Pickle are pickers. Available pickers are `DatePicker`, `MonthPicker` and `YearPicker`
- Each picker is a class that can be instantiated alone or by an instance of the `DatePickle` main class
- The `DatePickle` instance allows to lazy-load the three pickers and share state among them
- The basic output of pickers are a list of **items**, which are objects calculated upon picker state changes
- Each picker has some state and events, signaling state changes

## Items

Items (of types `DayItem`, `MonthItem` and `YearItem`) all extend a common `DatePickleItem` interface

```ts
interface DatePickleItem {
  isNow: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
}
```

Each picker has specific items, for example `DatePicker` outputs `DayItem` items having a unique `isWeekend` boolean key

```ts
interface DayItem extends DatePickleItem {
  date: Date;
  isWeekend: boolean;
}
```

## Picker events

Whenever relevant parts of the state get updated (including recalculating items), pickers fire several events that you can listen to via callbacks, registered via these methods

- `onItemsChange`
- `onSelected`
- `onFocused`

All these methods register a `DatePickleEventHandler` callback, which simply returns the data associated with the event as the only function argument, ex.

```ts
const picker = new DatePicker();
picker.onItemsChange((items: DayItem[]) => console.log('items', items));
picker.onSelected((d: Date) => console.log('selected', d));
picker.onFocused((d: Date) => console.log('focused', d));
```

Please note that
- If `sync` key is disabled (see **Picker state** section below), no callback is fired
- If `sync` key is enabled, the callback fires every time the related state changes and **immediately upon registration**, if related state is present

```ts
const picker = new DatePicker();
picker.selected = new Date();

// This fires immediately, since related state (items) exist
picker.onItems(items => console.log('items', items));

// This callback waits because related state exists, but sync = false
picker.sync = false;
picker.onSelected((d: Date) => console.log('selected', d));
picker.sync = true; // Now onSelected fires

// This waits for some focused state, since no related state is found (default is undefined)
picker.onFocused((d: Date) => console.log('focused', d));

// Now the previously registered onFocused callback fires
picker.focused = new Date();
```

## Picker state

**State** is internally managed by any picker, but you can alter it via setters or via options directly upone picker's creation

```ts
// Initialize state via options
const options = { selected: new Date('2022-01-01') };
const picker = new DatePicker(new Date(), options);

// Or create picker and set state later
const picker = new DatePicker();
picker.selected = new Date('2022-01-01');
```

## State synchronization

**NOTE**: Examples above are **NOT EQUIVALENT**. In fact, in the second the state is set later, so it is initialized to its default value, items are calculated automatically, then state is changed with `picker.selected` and items are recalculated again. To prevent unnecessary calculations, either set values upon creation with options (first example), or use the `sync` property like this

```ts
// Create a picker with sync = false, no items are calculated
const options = { sync: false };
const picker = new DatePicker(new Date(), options);

// Alter some state
picker.min = new Date('2010-03-03');
picker.max = new Date('2020-03-03');
picker.locale = 'it';

// Re-enable sync (recalculates items)
picker.sync = true;

// Another state manipulation session, later
picker.sync = false;
picker.focused = new Date('2022-06-06');
picker.locale = 'en';
picker.sync = true;
```

## Changing pages
- A *page* is just a collection of items depending on the picker, so a page is
  - a month for `DatePicker`
  - a year for a `MonthPicker`
  - 12 years for a `YearPicker`

- Why 12 years and not a *decade*? Simply because 12 is a very comfortable number to work with, while building UIs: a year has 12 months, so switching between a `MonthPicker` and `YearPicker` does not disrupt the UI, also you can have 4 rows of 3 years, 3 rows of 4 years, 6 rows of 2 years etc.

- Items on a page are primarily calculated based on a inaccessible `ref` state key which is completely managed by the library and represents a `Date` around which items are calculated
- All pickers have a number of methods to change page (by internally changing `ref` state key)
  - `now`
    - Switch to a page containing today
  - `prev`
    - Only `DatePicker` and `YearPicker`
    - Switch to previous page (ex.: previous month for `DatePicker`)
  - `next`
    - Only `DatePicker` and `YearPicker`
    - Switch to next page (ex.: next month for `DatePicker`)

## Disabling items
- All items share a `isDisabled` boolean key telling the UI the item is disabled (usually greyed out and unclickable, like days from previou and next month on a regular date picker)
- Disabled state of items can be regulated by setting either one or both the `min` and the `max` property on any picker
- `min`/`max` form an inclusive range (meaning items `>= min` and `<=max`) have `isDisabled = false`
- When setting `min`/`max` values, items are compared with `min`/`max` with a precision that depends on their picker
- Ex.: `min`/`max` on `YearPicker` are compared by same year
- Ex.: `min`/`max` on `DatePicker` are compared by same day
- Comparisons are performed via Date Pickle's `comparableDate()` utility

```ts
const d = new Date('2022-05-05');
const picker = new DatePicker(d);
picker.min = new Date('2022-05-04');
picker.max = new Date('2022-05-05');

const items = picker.items!;
console.log(items[8].isDisabled);  // true (May 3rd)
console.log(items[9].isDisabled);  // false (May 4th)
console.log(items[10].isDisabled); // false (May 5th)
console.log(items[11].isDisabled); // true (May 6th)
```

## `DatePicker` "peeking" days from previous and next months
- The `DatePicker` has a distinctive algorithm to calculate items, so that days from the previous and next month are shown, if the current month's days do not start on monday and/or do not end on sunday
- This behavior is completely expected by any date picker, but please mind that, since calculated items are more than the days of their month, most likely the **first** item is **NOT** is the first day of the month and the **last** item is **NOT** the last day of the month
- Also, days "peeking" from previous and next months always have `isDisabled: true` by default, regardless of the `min`/`max` values
