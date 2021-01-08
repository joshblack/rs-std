import * as Option from '../option';

test('Some returns an Option::Some', () => {
  const option = Option.Some(1);
  expect(Option.isSome(option)).toBe(true);
  expect(Option.isNone(option)).toBe(false);
});

test('None returns an Option::None', () => {
  const option = Option.None;
  expect(Option.isNone(option)).toBe(true);
  expect(Option.isSome(option)).toBe(false);
});

test('unwrap returns the value of Option::Some', () => {
  const option = Option.Some(1);
  expect(Option.unwrap(option)).toBe(1);
});

test('unwrap throws if the option is Option::None', () => {
  const option = Option.None;
  expect(() => {
    Option.unwrap(option);
  }).toThrow();
});

test('unwrapOr returns a contained Some value or the default', () => {
  const option1 = Option.Some(1);
  const option2 = Option.None;

  expect(Option.unwrapOr(option1, 2)).toBe(1);
  expect(Option.unwrapOr(option2, 2)).toBe(2);
});

test('unwrapOrElse returns a contained Some value or computes the default', () => {
  const option1 = Option.Some(1);
  const option2 = Option.None;

  expect(Option.unwrapOrElse(option1, () => 2)).toBe(1);
  expect(Option.unwrapOrElse(option2, () => 2)).toBe(2);
});

test('map transforms the contained Some value', () => {
  const option1 = Option.Some(2);
  const option2 = Option.None;

  function double(number) {
    return number * 2;
  }

  expect(Option.map(option1, double)).toEqual(Option.Some(4));
  expect(Option.map(option2, double)).toEqual(option2);
});

test('mapOr transforms the contained Some value or provides a default', () => {
  const option1 = Option.Some(2);
  const option2 = Option.None;

  function double(number) {
    return number * 2;
  }

  expect(Option.mapOr(option1, 8, double)).toBe(4);
  expect(Option.mapOr(option2, 8, double)).toBe(8);
});
