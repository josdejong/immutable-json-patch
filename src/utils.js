/**
 * Test deep equality of two JSON values, objects, or arrays
 * @param {JSON} a
 * @param {JSON} b
 * @returns {boolean}
 */
// TODO: write unit tests
export function isEqual (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Get all but the last items from an array
 * @param {Array} array
 * @return {Array}
 */
// TODO: write unit tests
export function initial (array) {
  return array.slice(0, array.length - 1)
}

/**
 * Get the last item from an array
 * @param {Array} array
 * @returns {*}
 */
// TODO: write unit tests
export function last (array) {
  return array[array.length - 1]
}

/**
 * Test whether a value is an Object or an Array (and not a primitive JSON value)
 * @param {*} value
 * @return {boolean}
 */
// TODO: write unit tests
export function isObjectOrArray (value) {
  return typeof value === 'object' && value !== null
}
