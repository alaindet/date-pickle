// console.log('Date Pickle Demo');

// export {};

import { MonthPicker } from './pickers/month-picker/month-picker';

const d = new Date('2006-02-20');
const picker = new MonthPicker(d, { focused: d });
console.table(picker.items);
