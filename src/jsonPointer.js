import { getIn } from './immutabilityHelpers.js'

/**
 * Parse a JSON Pointer
 * @param {JSONPointer} pointer
 * @return {string[]}
 */
export function parseJSONPointer (pointer) {
  const path = pointer.split('/')
  path.shift() // remove the first empty entry

  return path.map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'))
}

/**
 * Parse a JSONPointer, and turn array indices into numeric values.
 * For example, '/array/2/name' returns ['array', 2, 'name'] when array turns
 * out to be an actual Array
 * @param {JSONData} json
 * @param {JSONPointer} pointer
 * @return {JSONPath}
 */
export function parseJSONPointerWithArrayIndices (json, pointer) {
  const path = parseJSONPointer(pointer)

  // parse Array indexes into a number
  for (let i = 0; i < path.length; i++) {
    const section = path[i]

    if (ARRAY_INDEX_REGEX.exec(section)) {
      // this path part contains a number.
      // See if the document actually contains an array
      const parentPath = path.slice(0, i)
      const parent = getIn(json, parentPath)

      if (Array.isArray(parent)) {
        path[i] = parseInt(section, 10)
      }
    }
  }

  return path
}

// test whether a string only contains one or digits, like "1" or "204"
const ARRAY_INDEX_REGEX = /^\d+$/

/**
 * Compile a JSON Pointer
 * @param {JSONPath} path
 * @return {JSONPointer}
 */
export function compileJSONPointer (path) {
  return path
    .map(compileJSONPointerProp)
    .join('')
}

/**
 * Compile a single path property from a JSONPath
 * @param {string | number} pathProp
 * @returns {JSONPointer}
 */
export function compileJSONPointerProp (pathProp) {
  return '/' + String(pathProp).replace(/~/g, '~0').replace(/\//g, '~1')
}

/**
 * Append a path property to a JSONPointer
 * @param {JSONPointer} pointer
 * @param {string | number} pathProp
 * @returns {JSONPointer}
 */
export function appendToJSONPointer (pointer, pathProp) {
  return pointer + compileJSONPointerProp(pathProp)
}

/**
 * @param {JSONPointer} pointer
 * @param {JSONPointer} searchPointer
 * @returns {boolean}
 */
export function startsWithJSONPointer (pointer, searchPointer) {
  return (
    pointer.startsWith(searchPointer) &&
    (pointer.length === searchPointer.length || pointer[searchPointer.length] === '/')
  )
}
