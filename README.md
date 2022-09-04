# Date Pickle

![Date Pickle logo](https://raw.githubusercontent.com/alaindet/date-pickle/main/logo.png)

Date Pickle is framework-agnostic browser library written in TypeScript for **creating calendars** in the browser. It manages state and events by providing three date pickers

- Year Picker
- Month Picker
- Date Picker

Pickers can be either used completely standalone, or grouped in a `DatePickle` class instance, sharing current date, locales and min/max validation constraints.

Month names are translated with the provided locale via [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), so Date Pickle only works on browsers.

## Quick start

```
# Coming soon
npm install date-pickle
```

### Manual installation
```
git clone https://github.com/alaindet/date-pickle
cd ./date-pickle
npm run install
npm run release # Creates date-pickle-<VERSION>.tgz
```

In your project

```
npm install PATH_TO_TGZ_FILE
# Ex.: npm install ../date-pickle/date-pickle-0.0.4.tgz
```

## Usage

```ts
import { DatePickle } from './date-pickle';

const pickle = new DatePickle(new Date('2022-09-02'), 'en');

// Pickers are lazy-loaded singletons
console.log(pickle.existsYearPicker()); // false
pickle.yearPicker; // Instantiated upon first access
console.log(pickle.existsYearPicker()); // true

const datePicker = pickle.datePicker;

// Synchronous access to items
console.log(datePicker.items);
// [
//   ...omitted,
//   {
//     date: 2022-09-09T22:00:00.000Z,
//     isWeekend: true,
//     isCurrent: false,
//     isDisabled: false
//   },
//   ...omitted,
// ]

// Asynchronous access to items
datePicker.onItemsChange(items => console.log(items));
// Prints same as above

// First month of the year, localized
let firstMonthName = pickle.monthPicker.items![0].name;
console.log(firstMonthName); // 'january'

// Change localization (it's propagated to inner month picker)
pickle.locale = 'it';
firstMonthName = pickle.monthPicker.items![0].name;
console.log(firstMonthName); // 'gennaio'

// Perform some manipulation then update items
pickle.shouldUpdate = false;
datePicker.max = new Date('2001-01-20');
datePicker.current = new Date('2001-03-03'); // Set to march
datePicker.prev(); // Go to february
datePicker.prev(); // Go to january
pickle.shouldUpdate = true;

console.log(datePicker.items);
// [
//   ...
//   { date: 2001-01-19T23:00:00.000Z, isDisabled: false, ... },
//   { date: 2001-01-20T23:00:00.000Z, isDisabled: true, ... },
//   ...
// ]
```
