import type { JSONData } from './types'

/**
 * Test deep equality of two JSON values, objects, or arrays
 */
// TODO: write unit tests
export function isEqual (a: JSONData, b: JSONData) : boolean {
  // FIXME: this function will return false for two objects with the same keys
  //  but different order of keys
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Test whether two values are strictly equal
 */
export function strictEqual (a: unknown, b: unknown) : boolean {
  return a === b
}

/**
 * Get all but the last items from an array
 */
// TODO: write unit tests
export function initial<T> (array: Array<T>) : Array<T> {
  return array.slice(0, array.length - 1)
}

/**
 * Get the last item from an array
 */
// TODO: write unit tests
export function last<T> (array: Array<T>) : T | undefined {
  return array[array.length - 1]
}

/**
 * Test whether array1 starts with array2
 * @param array1
 * @param array2
 * @param [isEqual] Optional function to check equality
 */
export function startsWith<T> (array1: Array<T>, array2: Array<T>, isEqual = strictEqual) : boolean {
  if (array1.length < array2.length) {
    return false
  }

  for (let i = 0; i < array2.length; i++) {
    if (!isEqual(array1[i], array2[i])) {
      return false
    }
  }

  return true
}

/**
 * Test whether a value is an Object or an Array (and not a primitive JSON value)
 */
// TODO: write unit tests
export function isObjectOrArray (value: unknown) : boolean {
  return typeof value === 'object' && value !== null
}
