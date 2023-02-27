import { BaseItem, Locale, TIME_INTERVAL, TimeInterval } from '@/types';

export type PickerConfig = {
  cursor: Date;
  min?: Date | null;
  max?: Date | null;
  locale?: Locale | null;
  selected?: Date | null;
  focused?: Date | null;
  focusOffset?: number;
};

export type PickerOptions = {
  min: Date | null;
  max: Date | null;
  locale: Locale;
  selected: Date | null;
  focused: Date | null;
  focusOffset: number;
  timeInterval: TimeInterval;
};

export type PickerState<TItem extends BaseItem> = {
  cursor: Date;
  options: PickerOptions;
  items: TItem[];
  title: string;
};

export type PickerSelectors<TItem extends BaseItem> = Partial<{
  stateChange: (state: PickerState<TItem>) => void;
  itemsChange: (items: TItem[]) => void;
  titleChange: (title: string) => void;
  focusedChange: (focused: Date | undefined) => void;
  selectedChange: (selected: Date | undefined) => void;
}>;

export type PickerReducers<TItem extends BaseItem> = {
  setCursor: (state: PickerState<TItem>, cursor: Date | null) => PickerState<TItem>;
  // ...
};

export type PickerActions = {
  setCursor: (cursor: Date | null) => void;
  setMin: (min: Date | null) => void;
  setMax: (max: Date | null) => void;
  setLocale: (locale: Locale | null) => void;
  setSelectedDate: (selected: Date | null) => void;
  setFocusedDate: (focused: Date | null) => void;
  setFocusOffset: (offset: number) => void;
  now: () => void;
  prev: () => void;
  next: () => void;
  focusItemByOffset: (offset: number) => void;
  focusItemByIndex: (index: number) => void;
  focusPreviousItem: () => void;
  focusNextItem: () => void;
  focusPreviousItemByOffset: (offset: number) => void;
  focusNextItemByOffset: (offset: number) => void;
  focusFirstItemOfPage: () => void;
  focusLastItemOfPage: () => void;
};

export function setCursor<TItem extends BaseItem>(
  state: PickerState<TItem>,
  cursor: Date | null,
): PickerState<TItem> {
  return { ...state, cursor: cursor ?? new Date() };
}

const mutators: Partial<PickerActions> = {
  setCursor: (cursor: Date | null) => ({ type: 'setCursor', payload: cursor }),
};

type WithoutFirstElement<T extends unknown[]> = T extends [unknown, ...infer R] ? R : [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithoutFirstParam<T extends (...args: any) => void> =
  WithoutFirstElement<Parameters<T>>;

export function createPicker<TItem extends BaseItem>(
  initialState: PickerState<TItem>,
) {
  let state = initialState;

  const dispatch = (action: PickerAction) => {
    state = reducer(action);
  };

  return {
    actions: {
      setCursor,
    },
  };
}
