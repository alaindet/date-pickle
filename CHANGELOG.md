# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [0.0.16] Unreleased

### Changed
- `set BasePicker.cursor` accepts `Date` and `Date | null`

## [0.0.14] 2023-02-23

### Added
- `/jest.config.ts`
- Add unit tests for base `Picker` class
- Add `Picker.updateAfter()` method to group state changes before updating items
- Add `findLastIndex()` utility function
- Add `getUniqueDayId` utility function
- Add `startWith` property to `YearPicker`
- Add methods to de-register from pickers' events

### Changed
- Use `getUniqueDayId` to guarantee uniqueness for any item of any picker
  - This is used to differentiate pages
- Event listeners now do not trigger upon registration by default, but it can be changed
  ```ts
  dp.onItemsChange(callback); // Waits for next state change
  dp.onItemsChange(callback, true); // Fires immediately
  ```

### Removed
- `/jest.config.js`
- Remove `DatePickle` parent class
- `sync` property, now everything is immediately sync'ed by default, unless you're updating props in a `Picker.updateAfter()` callback
- `ref` property, replaced by `cursor`

### Fixed
- `MonthPicker` wrong hard-coded year used for building items
