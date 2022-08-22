import type { JSONPath, JSONPointer } from './types'

/**
 * Parse a JSON Pointer
 */
export function parseJSONPointer (pointer: JSONPointer) : string[] {
  const path = pointer.split('/')
  path.shift() // remove the first empty entry

  return path.map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'))
}

/**
 * Compile a JSON Pointer
 */
export function compileJSONPointer (path: JSONPath) : JSONPointer {
  return path
    .map(compileJSONPointerProp)
    .join('')
}

/**
 * Compile a single path property from a JSONPath
 */
export function compileJSONPointerProp (pathProp: string | number) : JSONPointer {
  return '/' + String(pathProp).replace(/~/g, '~0').replace(/\//g, '~1')
}

/**
 * Append a path property to a JSONPointer
 */
export function appendToJSONPointer (pointer: JSONPointer, pathProp: string | number) : JSONPointer {
  return pointer + compileJSONPointerProp(pathProp)
}

/**
 * Test whether `pointer` starts with `searchPointer`
 */
export function startsWithJSONPointer (pointer: JSONPointer, searchPointer: JSONPointer) : boolean {
  return (
    pointer.startsWith(searchPointer) &&
    (pointer.length === searchPointer.length || pointer[searchPointer.length] === '/')
  )
}
