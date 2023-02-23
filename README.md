# Date Pickle

![Date Pickle logo](https://raw.githubusercontent.com/alaindet/date-pickle/main/logo.png)

Date Pickle is a ~2 kB (gzipped) framework-agnostic fully tested TypeScript library with zero runtime dependencies for **creating calendars** (date pickers, month pickers, year pickers) and managing their state. It features date selection, min/max ranges and focus management for accessibility.

It is **not a UI library**: you take care of the UI and the user interaction with your favorite framework/library and Date Pickle takes care of managing and outputting immutable state.

## How does it work?

- At its core, Date Pickle is a collection of configurable picker classes:
  - `DatePicker`
  - `MonthPicker`
  - `YearPicker`
- The library is synchronous, you can register callbacks that get notified at each state change
- The two main concepts are `items` and `pages`
- An `item` is an object containing UI-friendly info for that item (say "a day" for a typical `DatePicker` or "a month" for a `MonthPicker`), with properties like `isSelected`, `isFocused`, `label`
- Items are contextual to pickers, e.g. an item is
  - a day in a month for a `DatePicker`,
  - a month in a year for a `MonthPicker`
  - a year in a decade for a `YearPicker`
- A `page` is just a collection of related items, e.g. a page is "a month" for a `DatePicker` etc.
- Pages can include items "peeking" from previous/following pages, like days from a previous month filling up the week, or years in the previous/following decade filling up a typical 4x3 grid
- Pickers expose methods to alter the state and callbacks to listen to it
- `DatePickle` is just an optional parent class for lazy instantiation of individual pickers sharing the same options

## Items

Items are of types `DayItem`, `MonthItem` and `YearItem` and they all extend a common `BaseItem` type

```ts
type BaseItem  = {

  // Guaranteed unique 8-digit ID across all pages and all pickers
  // Ex.: "2023-02-23" is 20230223, "2022-08" is 20220899, "2020" is 20209999
  id: number;

  // Can be used in UI, ex.: "january" for MonthPicker, "2022" for YearPicker
  label: string;

  // Date instance of the item for further checks and manipulations
  date: Date;

  // Whether the item is now: "today" for DatePicker, "this month" for MonthPicker,
  // "this year" for YearPicker
  isNow: boolean;

  // Whether the item is disabled (out of min/max range or peeking from adjacent months
  // in the case of DatePicker)
  isDisabled: boolean;

  // Whether the item is selected, based on the `selected: Date` picker's property
  isSelected: boolean;

  // Wheter the item is focused, based on the `focused: Date` picker's property
  isFocused: boolean;
};
```

`MonthItem` and `YearItem` extend the `BaseItem` as it is, while the `DayItem` adds a property

```ts
type DayItem = BaseItem & {
  isWeekend: boolean;
};
```

## Quick usage
```ts
import { DatePicker } from './pickers/date-picker/date-picker';

const dp = new DatePicker(new Date('2022-09-09'));

// Listen to items
dp.onItemsChange(items => console.log(items));

// [
//   ...
//     {
//     id: 20220903,
//     label: '3',
//     date: 2022-09-03T00:00:00.000Z,
//     isWeekend: true,
//     isNow: false,
//     isDisabled: false,
//     isSelected: false,
//     isFocused: false
//   },
//   ...
// ]

// Listen to focused date
dp.onFocusedChange(focused => console.log(focused));

// Listen to selected date
dp.onSelectedChange(selected => console.log(selected));

// Move cursor to the previous month
// Updates items immediately, triggers `onItemsChange` handler
dp.prev();

// Set `isDisabled: true` on all items > '2022-08-08'
// Updates items immediately, triggers `onItemsChange` handler
dp.max = new Date('2022-08-08');

// Group state changes and update items afterwards
dp.updateAfter(() => {
  dp.next(); // Moves page to September 2022
  dp.prev(); // Moves page to August 2022
  dp.next(); // Moves page to September 2022
  dp.next(); // Moves page to October 2022
  dp.focused = new Date('2022-10-10');
});
```

## Pickers
- Pickers are instances of `DatePicker`, `MonthPicker` or `YearPicker`
- A picker has an inner cursor of type `Date` which serves as the base for calculating end members of a page and then all items within it
  - For example, a cursor set to `2022-01-01` in a `DatePicker` prints out all days in january 2022 (and some days from december 2021 and february 2022)
- The cursor is mostly abstracted away from the user, but you can access it, change it manually or directly set it when creating the picker, like `const dp = new DatePicker(new Date('2023-02-03'))`

### Initialization
Pickers can be initialized with zero, one or two arguments
```ts
// Zero arguments: Cursor is today, properties use defaults
const dp1 = new DatePicker();

// One argument: the cursor
const dp2 = new DatePicker(new Date('2023-02-02'));

// One argument: the options
const min = new Date('2023-02-10');
const max = new Date('2023-02-20');
const dp3 = new DatePicker({ min, max });

// Two arguments: cursor and options
const dp4 = new DatePicker(cursor, { min, max });

// Equivalent to above, you can set the cursor as an option
const dp5 = new DatePicker({ cursor, min, max });
```

### Properties
- Every picker extends an abstract `BasePicker` class and has the same properties
- Most properties update state immediately when they're explicitly set, unless you set them in an `updateAfter` callback
- Properties can be set explicitly, like `dp.selected = new Date()`, or upon the picker's creation as options, like `const dp = DatePicker({ selected: new Date() })`
- The `focused` and the `selected` properties also move the cursor when you set them, since a "focused" or "selected" item on an invisible page makes no sense

## Focus management
Let's say you build a simple calendar with rows of days representing weeks as usual. There's already a focused element, you press Arrow Up and you want the day "on top" to focus, or maybe you press Home and want the first day of the month to focus, how to do that?

Date Pickle helps you by exposing some methods to move focus in a predictable way. For example

```ts
const d = new Date('2023-02-23');
const dp = new DatePicker({ cursor: d, focused: d });
dp.focusOffset = 7; // Already set to 7 by default
dp.focusPreviousItemByOffset(); // Moves focus to a week earlier (Arrow Up)
dp.focusNextItemByOffset(); // Moves focus to a week later (Arrow Down)
dp.focusFirstItemOfPage(); // Moves focus to first day of month (Home)
dp.focusLastItemOfPage(); // Moves focus to last day of month (End)
dp.focusNextItem(); // Moves focus to the next day (Arrow Right)
dp.focusPreviousItem(); // Moves focus to the previous day (Arrow Left)
dp.focusItemByIndex(12); // Moves focus to an arbitrary item index on a page
dp.focusItemByOffset(12); // Moves focus to an arbitrary number of time intervals

dp.focusNextItemByOffset(3);
// Equivalent to `dp.focusItemByOffset(3)`, does not affect `focusOffset`

dp.focusPreviousItemByOffset(10);
// Equivalent to `dp.focusItemByOffset(-10)`, does not affect `focusOffset`
```

- Moving focus to another page also moves the cursor (and all items) to that page
- The `focusOffset` represents the number of "time intervals" the focused date must jump, e.g. "day" for `DatePicker`, "month" for `MonthPicker`, "year" for `YearPicker`
- There can be only up to ONE focused item on the page, or no one focused
- Date Pickle does not handle HTML, so tabIndex attributes and keyboard event capturing are the user's responsibility
- `focusItemByOffset()` accepts negative integers as well to go back in time

## Public API
See [Date Pickle Public API](https://github.com/alaindet/date-pickle/blob/main/docs/public-api.md)
