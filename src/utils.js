/**
 * Test deep equality of two JSON values, objects, or arrays
 * @param {JSONData} a
 * @param {JSONData} b
 * @returns {boolean}
 */
// TODO: write unit tests
export function isEqual (a, b) {
  // FIXME: this function will return false for two objects with the same keys
  //  but different order of keys
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Test whether two values are strictly equal
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
export function strictEqual (a, b) {
  return a === b
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
 * Test whether array1 starts with array2
 * @param {Array} array1
 * @param {Array} array2
 * @param {function} [isEqual=strictEqual] Optional function to check equality
 */
export function startsWith (array1, array2, isEqual = strictEqual) {
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
 * @param {*} value
 * @return {boolean}
 */
// TODO: write unit tests
export function isObjectOrArray (value) {
  return typeof value === 'object' && value !== null
}
