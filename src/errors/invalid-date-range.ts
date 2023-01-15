export class InvalidDateRangeError extends Error {

  range: any;

  constructor(message: string, range: any) {
    super(message);
    this.range = range;
  }
}
