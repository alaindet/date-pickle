# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [0.0.14] Unreleased

### Added
- `/jest.config.ts`
- Add unit tests for base `Picker` class
- Add `Picker.thenSync()` method to group state changes before updating items

### Changed
- Change `DatePickle.constructor` signature

### Removed
- `/jest.config.js`

### Fixed
- `MonthPicker` wrong hard-coded year used for building items
