/**
 * Parse a JSON Pointer
 * @param {JSONPointer} pointer
 * @return {JSONPath}
 */
export function parseJSONPointer (pointer) {
  const path = pointer.split('/')
  path.shift() // remove the first empty entry

  return path.map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'))
}

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
