/**
 * Parse a JSON Pointer
 * @param {string} pointer
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
 * @return {string}
 */
export function compileJSONPointer (path) {
  return path
    .map(p => '/' + String(p).replace(/~/g, '~0').replace(/\//g, '~1'))
    .join('')
}
