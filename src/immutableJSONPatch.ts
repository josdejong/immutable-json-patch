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
  JSONData,
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
export function immutableJSONPatch (json: JSONData, operations: JSONPatchDocument, options?:JSONPatchOptions) : JSONData {
  let updatedJson = json

  for (let i = 0; i < operations.length; i++) {
    validateJSONPatchOperation(operations[i])

    let operation: JSONPatchOperation = operations[i]

    // TODO: test before
    if (options && options.before) {
      const result = options.before(updatedJson, operation)
      if (result !== undefined) {
        if (result.json !== undefined) {
          updatedJson = result.json
        }
        if (result.operation !== undefined) {
          operation = result.operation
        }
      }
    }

    const previousJson = updatedJson
    const path = parsePath(updatedJson, operation.path)
    if (operation.op === 'add') {
      updatedJson = add(updatedJson, path, operation.value)
    } else if (operation.op === 'remove') {
      updatedJson = remove(updatedJson as JSONObject | JSONArray, path)
    } else if (operation.op === 'replace') {
      updatedJson = replace(updatedJson, path, operation.value)
    } else if (operation.op === 'copy') {
      updatedJson = copy(updatedJson, path, parseFrom(operation.from))
    } else if (operation.op === 'move') {
      updatedJson = move(updatedJson, path, parseFrom(operation.from))
    } else if (operation.op === 'test') {
      test(updatedJson, path, operation.value)
    } else {
      throw new Error('Unknown JSONPatch operation ' + JSON.stringify(operation))
    }

    // TODO: test after
    if (options && options.after) {
      const result = options.after(updatedJson, operation, previousJson)
      if (result !== undefined) {
        updatedJson = result
      }
    }
  }

  return updatedJson
}

/**
 * Replace an existing item
 */
export function replace (json: JSONData, path: JSONPath, value: JSONData) : JSONData {
  return setIn(json, path, value)
}

/**
 * Remove an item or property
 */
export function remove<T extends JSONArray | JSONObject> (json: T, path: JSONPath) : T {
  return deleteIn(json, path)
}

/**
 * Add an item or property
 */
export function add (json: JSONData, path: JSONPath, value: JSONData) : JSONData {
  if (isArrayItem(json, path)) {
    return insertAt(json, path, value)
  } else {
    return setIn(json, path, value)
  }
}

/**
 * Copy a value
 */
export function copy (json: JSONData, path: JSONPath, from: JSONPath) : JSONData {
  const value = getIn(json, from)

  if (isArrayItem(json, path)) {
    return insertAt(json, path, value)
  } else {
    const value = getIn(json, from)

    return setIn(json, path, value)
  }
}

/**
 * Move a value
 */
export function move (json: JSONData, path: JSONPath, from: JSONPath) : JSONData {
  const value = getIn(json, from)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const removedJson = deleteIn(json, from)

  return isArrayItem(removedJson, path)
    ? insertAt(removedJson, path, value)
    : setIn(removedJson, path, value)
}

/**
 * Test whether the data contains the provided value at the specified path.
 * Throws an error when the test fails
 */
export function test (json: JSONData, path: JSONPath, value: JSONData) {
  if (value === undefined) {
    throw new Error(`Test failed: no value provided (path: "${compileJSONPointer(path)}")`)
  }

  if (!existsIn(json, path)) {
    throw new Error(`Test failed: path not found (path: "${compileJSONPointer(path)}")`)
  }

  const actualValue = getIn(json, path)
  if (!isEqual(actualValue, value)) {
    throw new Error(`Test failed, value differs (path: "${compileJSONPointer(path)}")`)
  }
}

export function isArrayItem (json: JSONData, path: JSONPath) : json is JSONArray {
  if (path.length === 0) {
    return false
  }

  const parent = getIn(json, initial(path))

  return Array.isArray(parent)
}

/**
 * Resolve the path index of an array, resolves indexes '-'
 * @returns Returns the resolved path
 */
export function resolvePathIndex (json: JSONData, path: JSONPath) : JSONPath {
  if (last(path) !== '-') {
    return path
  }

  const parentPath = initial(path)
  const parent = getIn(json, parentPath)

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

export function parsePath (json: JSONData, pointer: JSONPointer) : JSONPath {
  return resolvePathIndex(json, parseJSONPointer(pointer))
}

export function parseFrom (fromPointer: JSONPointer) : JSONPath {
  return parseJSONPointer(fromPointer)
}
