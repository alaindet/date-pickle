# Date Pickle

![Date Pickle logo](https://raw.githubusercontent.com/alaindet/date-pickle/main/logo.png)

Date Pickle is a framework-agnostic fully-tested TypeScript library for **creating calendars** (date pickers, month pickers, year pickers) and managing their state. It features date selection, min and max limits, focus management for accessibility.

It is **not a UI library**: you take care of the UI and the user interaction and Date Pickle takes care of managing and outputting immutable state.

## How does it work?

- At its core, Date Pickle is a collection of configurable picker classes:
  - `DatePicker`
  - `MonthPicker`
  - `YearPicker`
- The two main concepts are `items` and `pages`
- An `item` is an object containing UI-friendly info for that item (say "a day" for a typical `DatePicker` or "a month" for a `MonthPicker`), like `isSelected`, `isFocused`, `label`
- Items are contextual to pickers, e.g. an item is "a day" for a `DatePicker`, it is "a month" for a `MonthPicker` etc.
- A `page` is just a collection of related items, e.g. "a month" for a `DatePicker` etc.
- A `DatePicker`'s page may also include days "peeking" from previous and following months if they fill up the weeks
- Pickers expose methods and callbacks to alter the state and listen to its changes
- `DatePickle` is just an optional grouping class for lazy-loading instantiation of individual pickers sharing the same options

## Items

Items are of types `DayItem`, `MonthItem` and `YearItem` and they all extend a common `BaseItem` type

```ts
type BaseItem  = {
  
  // Guaranteed unique 8-digit ID across all pages and pickers
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
  
  // Whether the item is selected, based on the `selected: Date` property
  isSelected: boolean;

  // Wheter the item is focused, based on the `focused: Date` property
  isFocused: boolean;
};
```

`MonthItem` and `YearItem` extend the `BaseItem` as is, while the `DayItem` adds a property

```ts
type DayItem = BaseItem & {
  isWeekend: boolean;
};
```

## Quick usage
TODO

## Pickers
TODO

### State
TODO

#### Synchronization
TODO

#### Change page
TODO

#### Disabling items
TODO

### Events
TODO

### Public API
TODO

### Examples
TODO
