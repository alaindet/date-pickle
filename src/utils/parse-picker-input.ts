import { ParsedPickerInput, PickerOptions } from '../types';

const isDate = (d?: any) => d && d instanceof Date;
const isNotDate = (d?: any) => d && !(d instanceof Date);

export function parsePickerInput(
  cursorOrOptions?: PickerOptions | Date,
  pickerOptions?: PickerOptions
): ParsedPickerInput {
  // No arguments
  if (!cursorOrOptions && !pickerOptions) {
    const cursor = new Date();
    const options = {};
    return { cursor, options };
  }

  // One argument: Date
  if (isDate(cursorOrOptions) && !pickerOptions) {
    const cursor = cursorOrOptions as Date;
    const options = {};
    return { cursor, options };
  }

  // One argument: PickerOptions
  if (isNotDate(cursorOrOptions) && !pickerOptions) {
    const cursor = new Date();
    const options = cursorOrOptions as PickerOptions;
    return { cursor, options };
  }

  // Two arguments: Date, PickerOptions
  if (isDate(cursorOrOptions) && isNotDate(pickerOptions)) {
    const cursor = cursorOrOptions as Date;
    const options = pickerOptions as PickerOptions;
    return { cursor, options: options! };
  }

  throw new Error('invalid input');
}
