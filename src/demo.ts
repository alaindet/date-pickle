import { YearPicker } from "./pickers/year-picker/year-picker";

console.log('\n\n');

const d = new Date('2006-02-20');
// const expected = new Date('2001-02-20'); // Month/day unused
const picker = new YearPicker(d, { focused: d });
picker.focusPreviousItem();

picker.onItemsChange(items => {
  console.table(items.map(({ date, isFocused }) => ({ date, isFocused })));
});
