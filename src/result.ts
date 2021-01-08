/**
 * Result is a type that represents either success (Ok) or failure (Err).
 * @see https://doc.rust-lang.org/std/result/enum.Result.html
 */

import type { Option } from './option';

import { Some, None } from './option';

type Result<T, E> = Ok<T> | Err<E>;

type Ok<T> = {
  type: 'ok';
  value: T;
};

type Err<E> = {
  type: 'err';
  value: E;
};

function Ok<T>(value: T): Ok<T> {
  return {
    type: 'ok',
    value,
  };
}

function Err<E>(value: E): Err<E> {
  return {
    type: 'err',
    value,
  };
}

// Returns true if the result is Ok.
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.type === 'ok';
}

// Returns true if the result is Err.
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.type === 'err';
}

// Converts result into an Option<T> and discards the error, if any.
export function ok<T, E>(result: Result<T, E>): Option<T> {
  if (isOk(result)) {
    return Some(result.value);
  }

  return None;
}

// Converts from Result<T, E> to Option<E>.
export function err<T, E>(result: Result<T, E>): Option<E> {
  if (isErr(result)) {
    return Some(result.value);
  }

  return None;
}

// Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.
export function map<T, E, U>(
  result: Result<T, E>,
  map: (value: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return Ok(map(result.value));
  }
  return result;
}

// Applies a function to the contained value (if Ok), or returns the provided default (if Err).
export function mapOr<T, E, U>(
  result: Result<T, E>,
  defaultValue: U,
  map: (value: T) => U
): U {
  if (isOk(result)) {
    return map(result.value);
  }
  return defaultValue;
}

// Maps a Result<T, E> to U by applying a function to a contained Ok value, or a fallback function to a contained Err value.
export function mapOrElse<T, E, U>(
  result: Result<T, E>,
  defaultMap: (value: E) => U,
  map: (value: T) => U
): U {
  if (isOk(result)) {
    return map(result.value);
  }
  return defaultMap(result.value);
}

// Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched.
export function mapElse<T, E, F>(
  result: Result<T, E>,
  map: (error: E) => F
): Result<T, F> {
  if (isOk(result)) {
    return result;
  }
  return Err(map(result.value));
}

// Returns an iterator over the possibly contained value.
// The iterator yields one value if the result is Result::Ok, otherwise none.
export function* iter<T, E>(result: Result<T, E>): Iterator<T> {
  if (isOk(result)) {
    yield result.value;
  }
}

// Returns res if the result is Ok, otherwise returns the Err value of self.
export function and<T, E, U>(
  result: Result<T, E>,
  then: Result<U, E>
): Result<U, E> {
  if (isOk(result)) {
    return then;
  }
  return result;
}

// Calls op if the result is Ok, otherwise returns the Err value of self.
export function andThen<T, E, U>(
  result: Result<T, E>,
  op: (value: T) => Result<U, E>
): Result<U, E> {
  if (isOk(result)) {
    return op(result.value);
  }
  return result;
}

// Returns res if the result is Err, otherwise returns the Ok value of self.
export function or<T, E, F>(
  result: Result<T, E>,
  fallback: Result<T, F>
): Result<T, F> {
  if (isOk(result)) {
    return result;
  }
  return fallback;
}

// Calls op if the result is Err, otherwise returns the Ok value of self.
export function orElse<T, E, F>(
  result: Result<T, E>,
  op: (error: E) => Result<T, F>
): Result<T, F> {
  if (isOk(result)) {
    return result;
  }
  return op(result.value);
}

// Returns the contained Ok value or a provided default.
export function unwrap<T, E>(result: Result<T, E>, fallback: T): T {
  if (isOk(result)) {
    return result.value;
  }
  return fallback;
}

// Returns the contained Ok value or computes it from a closure.
export function unwrapOrElse<T, E>(
  result: Result<T, E>,
  op: (error: E) => T
): T {
  if (isOk(result)) {
    return result.value;
  }
  return op(result.value);
}

// Converts from Result<Result<T, E>, E> to Result<T, E>
export function flatten<T, E>(result: Result<Result<T, E>, E>): Result<T, E> {
  if (isOk(result)) {
    return result.value;
  }
  return result;
}
