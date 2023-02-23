import { isInstanceOf } from './is-instance-of';

describe('isInstanceOf() utility function', () => {
  const justAnotherClass = class JustAnotherClass {
    foo?: string;
  };
  const yetAnotherClass = class YetAnotherClass {
    bar?: number;
  };

  it('should recognize instances of built-in classes', () => {
    const result = isInstanceOf(new Date(), Date);
    expect(result).toBeTruthy();
  });

  it('should recognize instances of custom classes', () => {
    const anObj = new justAnotherClass();
    const result = isInstanceOf(anObj, justAnotherClass);
    expect(result).toBeTruthy();
  });

  it('should reject instances of different classes than given class', () => {
    const anObj = new yetAnotherClass();
    expect(isInstanceOf(anObj, justAnotherClass)).toBeFalsy();
    expect(isInstanceOf(anObj, Date)).toBeFalsy();
  });

  it('should recognize most objects and arrays as instance of Object', () => {
    const anObj = new justAnotherClass();
    expect(isInstanceOf(anObj, Object)).toBeTruthy();
    expect(isInstanceOf([1, 2, 3], Object)).toBeTruthy();
    expect(isInstanceOf({}, Object)).toBeTruthy();
  });
});
