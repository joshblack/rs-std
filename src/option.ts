export type Option<T> = Some<T> | None;

export type Some<T> = {
  type: 'some';
  value: T;
};

export type None = {
  type: 'none';
};

export function Some<T>(value: T): Some<T> {
  return {
    type: 'some',
    value,
  };
}

export const None: None = {
  type: 'none',
};

// Returns true if the option is a Some value.
export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.type === 'some';
}

// Returns true if the option is a None value.
export function isNone<T>(option: Option<T>): option is None {
  return option.type === 'none';
}

// Returns the contained Some value, consuming the self value.
export function unwrap<T>(option: Option<T>): T {
  if (isSome(option)) {
    return option.value;
  }
  throw new Error('Option is of type None, no value is available');
}

// Returns the contained Some value or a provided default.
export function unwrapOr<T>(option: Option<T>, defaultValue: T): T {
  if (isSome(option)) {
    return option.value;
  }
  return defaultValue;
}

// Returns the contained Some value or computes it from a closure.
export function unwrapOrElse<T>(option: Option<T>, f: () => T): T {
  if (isSome(option)) {
    return option.value;
  }
  return f();
}

// Maps an Option<T> to Option<U> by applying a function to a contained value.
export function map<T, U>(
  option: Option<T>,
  mapFn: (value: T) => U
): Option<U> {
  if (isSome(option)) {
    return Some(mapFn(option.value));
  }
  return option;
}

// Applies a function to the contained value (if any), or returns the provided default (if not).
export function mapOr<T, U>(
  option: Option<T>,
  defaultValue: U,
  mapFn: (value: T) => U
): U {
  if (isSome(option)) {
    return mapFn(option.value);
  }
  return defaultValue;
}
