# Date Pickle

![Date Pickle logo](https://raw.githubusercontent.com/alaindet/date-pickle/main/logo.png)

Date Pickle is a TypeScript browser library for **creating calendars**. It is framework-agnostic, fully tested and with zero runtime dependencies.

Time unit names (months, weekdays) are translated with the provided locale via the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) browser API, so Date Pickle only works on browsers.

## Installation

```
npm install date-pickle
```

## At a glance

```ts
import { DatePickle } from 'date-pickle';

const pickle = new DatePickle(new Date('2022-09-07'));

const datePicker = pickle.datePicker;
console.log(datePicker.items);
// [
//   ...omitted,
//   {
//     date: 2022-09-09T00:00:00.000Z,
//     isWeekend: false,
//     isNow: false,
//     isDisabled: false,
//     isSelected: false,
//     isFocused: false
//   },
//   ...omitted,
// ]

// Asynchronous access to items
datePicker.onItemsChange(items => console.log(items));
// Prints same as above

// First month of the year, localized
pickle.locale = 'en';
let firstMonthName = pickle.monthPicker.items![0].name;
console.log(firstMonthName); // 'january'

// Change localization (it's propagated to inner month picker)
pickle.locale = 'it';
firstMonthName = pickle.monthPicker.items![0].name;
console.log(firstMonthName); // 'gennaio'

// Set some state then update items
pickle.sync = false;
datePicker.max = new Date('2001-01-20');
datePicker.ref = new Date('2001-03-03'); // Set to march
datePicker.prev(); // Go to february
datePicker.prev(); // Go to january
pickle.sync = true; // <-- Re-enables items calculation

console.log(datePicker.items);
// [
//   ...
//   { date: 2001-01-19T23:00:00.000Z, isDisabled: false, ... },
//   { date: 2001-01-20T23:00:00.000Z, isDisabled: true, ... },
//   ...
// ]

// Standalone picker (doesn't share any state with other pickers)
const datePickerStandalone = new DatePicker(new Date());
```

## Introduction

- At the core of Date Pickle are pickers. Available pickers are `DatePicker`, `MonthPicker` and `YearPicker`
- Each picker is a class that can be instantiated alone or by an instance of the `DatePickle` main class
- The `DatePickle` instance allows to lazy-load the three pickers and share state among them
- The basic output of pickers is a list of **items**, which are objects calculated when state changes
- Each picker has some state and events, fired on state changes

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

// This fires immediately, since related state (items) exist
picker.onItems(items => console.log('items', items));

// This callback waits because related state exists, but sync = false
picker.selected = new Date();
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

State is composed of these keys

- `items`: List of items, based on picker
- `min`: Minium date allowed (items before this are disabled)
- `max`: Maximum date allowed (items after this are disabled)
- `locale`: Language to use when translating (ex.: months names)
- `selected`: Currently select date
- `focused`: Currently focused date (different from selected, since in accessible calendar users can move between dates by focusing them, but only one is then is selected)
- `sync`: Whether to recalculate items and fire events when state changes or not

## State synchronization

**NOTE**: Examples above are **NOT EQUIVALENT**. In fact, in the second example the state is set later, so the state gets initialized to its default value, items are calculated automatically, then the state is changed with `picker.selected` and items are recalculated again. To prevent unnecessary calculations, either set values upon creation via options (first example), or use the `sync` property like this

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
- Ex.: Items in a month are calculated around a fictious `ref` set to midnight of the 15th day of that month
- All pickers have a number of methods to change page (by internally changing the `ref` state key)
  - `now`
    - Switches to the page containing today
  - `prev`
    - Only `DatePicker` and `YearPicker`
    - Switches to previous page (ex.: previous month for `DatePicker`)
  - `next`
    - Only `DatePicker` and `YearPicker`
    - Switches to next page (ex.: next month for `DatePicker`)

## Disabling items
- All items have a `isDisabled` boolean key telling the UI if the item is disabled (usually grayed out and unclickable, like days from previous and next month on a regular date picker)
- Disabled state of items can be regulated by setting either one or both the `min` and the `max` property on any picker
- `min`/`max` values form an inclusive range (meaning items `>= min` and `<= max`) of items with `isDisabled = false`
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
- The `DatePicker` has a distinctive algorithm to calculate items, so that days from the previous and next month are shown to fill the weeks, if the current month's days do not start on monday and/or do not end on sunday
- This behavior is completely expected by any date picker, but please mind that, since calculated items are more than the days of their month, most likely the **first** item is **NOT** is the first day of the month and the **last** item is **NOT** the last day of the month
- Also, days "peeking" from previous and next months always have `isDisabled: true` by default, regardless of the `min`/`max` values
