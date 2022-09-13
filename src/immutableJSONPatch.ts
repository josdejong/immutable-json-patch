import {
  deleteIn,
  existsIn,
  getIn,
  insertAt,
  setIn
} from './immutabilityHelpers.js'
import { compileJSONPointer, parseJSONPointer } from './jsonPointer.js'
import {
  JSONArray,
  JSONValue,
  JSONObject,
  JSONPatchDocument,
  JSONPatchOperation,
  JSONPatchOptions,
  JSONPath,
  JSONPointer
} from './types'
import { initial, isEqual, last } from './utils.js'

/**
 * Apply a patch to a JSON object
 * The original JSON object will not be changed,
 * instead, the patch is applied in an immutable way
 */
export function immutableJSONPatch (document: JSONValue, operations: JSONPatchDocument, options?:JSONPatchOptions) : JSONValue {
  let updatedDocument = document

  for (let i = 0; i < operations.length; i++) {
    validateJSONPatchOperation(operations[i])

    let operation: JSONPatchOperation = operations[i]

    // TODO: test before
    if (options && options.before) {
      const result = options.before(updatedDocument, operation)
      if (result !== undefined) {
        if (result.document !== undefined) {
          updatedDocument = result.document
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (result.json !== undefined) {
          // TODO: deprecated since v5.0.0. Cleanup this warning some day
          throw new Error('Deprecation warning: returned object property ".json" has been renamed to ".document"')
        }
        if (result.operation !== undefined) {
          operation = result.operation
        }
      }
    }

    const previousDocument = updatedDocument
    const path = parsePath(updatedDocument, operation.path)
    if (operation.op === 'add') {
      updatedDocument = add(updatedDocument, path, operation.value)
    } else if (operation.op === 'remove') {
      updatedDocument = remove(updatedDocument as JSONObject | JSONArray, path)
    } else if (operation.op === 'replace') {
      updatedDocument = replace(updatedDocument, path, operation.value)
    } else if (operation.op === 'copy') {
      updatedDocument = copy(updatedDocument, path, parseFrom(operation.from))
    } else if (operation.op === 'move') {
      updatedDocument = move(updatedDocument, path, parseFrom(operation.from))
    } else if (operation.op === 'test') {
      test(updatedDocument, path, operation.value)
    } else {
      throw new Error('Unknown JSONPatch operation ' + JSON.stringify(operation))
    }

    // TODO: test after
    if (options && options.after) {
      const result = options.after(updatedDocument, operation, previousDocument)
      if (result !== undefined) {
        updatedDocument = result
      }
    }
  }

  return updatedDocument
}

/**
 * Replace an existing item
 */
export function replace (document: JSONValue, path: JSONPath, value: JSONValue) : JSONValue {
  return setIn(document, path, value)
}

/**
 * Remove an item or property
 */
export function remove<T extends JSONArray | JSONObject> (document: T, path: JSONPath) : T {
  return deleteIn(document, path)
}

/**
 * Add an item or property
 */
export function add (document: JSONValue, path: JSONPath, value: JSONValue) : JSONValue {
  if (isArrayItem(document, path)) {
    return insertAt(document, path, value)
  } else {
    return setIn(document, path, value)
  }
}

/**
 * Copy a value
 */
export function copy (document: JSONValue, path: JSONPath, from: JSONPath) : JSONValue {
  const value = getIn(document, from)

  if (isArrayItem(document, path)) {
    return insertAt(document, path, value)
  } else {
    const value = getIn(document, from)

    return setIn(document, path, value)
  }
}

/**
 * Move a value
 */
export function move (document: JSONValue, path: JSONPath, from: JSONPath) : JSONValue {
  const value = getIn(document, from)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const removedJson = deleteIn(document, from)

  return isArrayItem(removedJson, path)
    ? insertAt(removedJson, path, value)
    : setIn(removedJson, path, value)
}

/**
 * Test whether the data contains the provided value at the specified path.
 * Throws an error when the test fails
 */
export function test (document: JSONValue, path: JSONPath, value: JSONValue) {
  if (value === undefined) {
    throw new Error(`Test failed: no value provided (path: "${compileJSONPointer(path)}")`)
  }

  if (!existsIn(document, path)) {
    throw new Error(`Test failed: path not found (path: "${compileJSONPointer(path)}")`)
  }

  const actualValue = getIn(document, path)
  if (!isEqual(actualValue, value)) {
    throw new Error(`Test failed, value differs (path: "${compileJSONPointer(path)}")`)
  }
}

export function isArrayItem (document: JSONValue, path: JSONPath) : document is JSONArray {
  if (path.length === 0) {
    return false
  }

  const parent = getIn(document, initial(path))

  return Array.isArray(parent)
}

/**
 * Resolve the path index of an array, resolves indexes '-'
 * @returns Returns the resolved path
 */
export function resolvePathIndex (document: JSONValue, path: JSONPath) : JSONPath {
  if (last(path) !== '-') {
    return path
  }

  const parentPath = initial(path)
  const parent = getIn(document, parentPath)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parentPath.concat(parent.length)
}

/**
 * Validate a JSONPatch operation.
 * Throws an error when there is an issue
 */
export function validateJSONPatchOperation (operation: JSONPatchOperation) {
  // TODO: write unit tests
  const ops = ['add', 'remove', 'replace', 'copy', 'move', 'test']

  if (!ops.includes(operation.op)) {
    throw new Error('Unknown JSONPatch op ' + JSON.stringify(operation.op))
  }

  if (typeof operation.path !== 'string') {
    throw new Error('Required property "path" missing or not a string in operation ' + JSON.stringify(operation))
  }

  if (operation.op === 'copy' || operation.op === 'move') {
    if (typeof operation.from !== 'string') {
      throw new Error('Required property "from" missing or not a string in operation ' + JSON.stringify(operation))
    }
  }
}

export function parsePath (document: JSONValue, pointer: JSONPointer) : JSONPath {
  return resolvePathIndex(document, parseJSONPointer(pointer))
}

export function parseFrom (fromPointer: JSONPointer) : JSONPath {
  return parseJSONPointer(fromPointer)
}
