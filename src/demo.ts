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
