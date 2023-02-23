import { BaseItem } from './item';

export type PickerEventHandler<T = unknown> = (data: T) => void;

export type PickerEventHadlers<TItem extends BaseItem> = {
  itemsChange?: PickerEventHandler<TItem[]>;
  focusedChange?: PickerEventHandler<Date | undefined>;
  selectedChange?: PickerEventHandler<Date | undefined>;
};
