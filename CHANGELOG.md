# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [0.0.14] Unreleased

### Added
- `/jest.config.ts`
- Add unit tests for base `Picker` class
- Add `Picker.thenUpdateItems()` method to group state changes before updating items
- Add `findLastIndex()` utility function
- Add `getUniqueDayId` utility function
- Add `startWith` property to `YearPicker`

### Changed
- Change `DatePickle.constructor` signature
- Use `getUniqueDayId` to guarantee uniqueness for any item of any picker
  - This is used to differentiate pages

### Removed
- `/jest.config.js`

### Fixed
- `MonthPicker` wrong hard-coded year used for building items
