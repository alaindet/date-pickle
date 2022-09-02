# Date Pickle

Date Pickle is framework-agnostic browser library written in TypeScript for **creating calendars** in the browser. It manages state and events by providing three date pickers

- Year Picker
- Month Picker
- Date Picker

Pickers can be either used completely standalone, or grouped in a `DatePickle` class instance, which shares current date, locales and min/max validation constraints

Month names are translated with the provided locale via [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), so Date Pickle only works on browsers.

## Usage

```ts
const ds = new DatePickle(new Date('2022-09-02'), 'en');

// Synchronous access to items
const items = ds.yearPicker.getItems();
console.log(items);
// Prints
// [
//   { year: 2017, isCurrent: false, isDisabled: false },
//   ...omitted
//   { year: 2022, isCurrent: true, isDisabled: false },
//   ...omitted
//   { year: 2028, isCurrent: false, isDisabled: false },
// ]

// Asynchronous access to items
ds.yearPicker.onItemsChange(items => console.log(items));
// Prints same as above

// Access the localized Month Picker
let firstMonthName = ds.monthPicker.getItems()[0].name;
console.log(firstMonthName); // 'january'

// Change localization (it's propagated to month picker)
ds.setLocale('it');
firstMonthName = ds.monthPicker.getItems()[0].name;
console.log(firstMonthName); // 'gennaio'

// Pickers are lazy-loaded singletons
console.log(ds.exists('date-picker')); // false
ds.datePicker // Instantiated upon first access
console.log(ds.exists('date-picker')); // true
```
