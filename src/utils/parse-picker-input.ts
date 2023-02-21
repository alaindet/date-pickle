import { ParsedPickerInput, PickerOptions } from '../types';

const isDate = (d?: any) => d && (d instanceof Date);
const isNotDate = (d?: any) => d && !(d instanceof Date);

export function parsePickerInput(
  refOrOptions?: PickerOptions | Date,
  pickerOptions?: PickerOptions,
): ParsedPickerInput {

  // No arguments
  if (!refOrOptions && !pickerOptions) {
    const ref = new Date();
    const options = {};
    return { ref, options };
  }

  // One argument: Date
  if (isDate(refOrOptions) && !pickerOptions) {
    const ref = refOrOptions as Date;
    const options = {};
    return { ref, options };
  }

  // One argument: PickerOptions
  if (isNotDate(refOrOptions) && !pickerOptions) {
    const ref = new Date();
    const options = refOrOptions as PickerOptions;
    return { ref, options };
  }

  // Two arguments: Date, PickerOptions
  if (isDate(refOrOptions) && isNotDate(pickerOptions)) {
    const ref = refOrOptions as Date;
    const options = pickerOptions as PickerOptions;
    return { ref, options: options! };
  }

  throw new Error('invalid input');
}
