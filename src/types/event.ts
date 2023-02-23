import { BaseItem } from './item';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PickerEventHandler<T = any> = (data: T) => void;

export type PickerEventHadlers<TItem extends BaseItem> = {
  itemsChange?: PickerEventHandler<TItem[]>;
  focusedChange?: PickerEventHandler<Date | undefined>;
  selectedChange?: PickerEventHandler<Date | undefined>;
};
