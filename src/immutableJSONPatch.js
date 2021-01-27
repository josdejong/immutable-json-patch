import {
  deleteIn,
  existsIn,
  getIn,
  insertAt,
  setIn
} from './immutabilityHelpers.js'
import { compileJSONPointer, parseJSONPointer } from './jsonPointer.js'
import { initial, isEqual, last } from './utils.js'

/**
 * Apply a patch to a JSON object
 * The original JSON object will not be changed,
 * instead, the patch is applied in an immutable way
 * @param {JSONData} json
 * @param {JSONPatchDocument} operations    Array with JSON patch actions
 * @param {JSONPatchOptions} [options]
 * @return {JSONData} Returns the updated json
 */
export function immutableJSONPatch (json, operations, options) {
  let updatedJson = json

  for (let i = 0; i < operations.length; i++) {
    validateJSONPatchOperation(operations[i])

    let operation = preprocessJSONPatchOperation(updatedJson, operations[i])

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
    const patchOp = PATCH_OPS[operation.op]
    if (patchOp) {
      updatedJson = patchOp(updatedJson, operation)
    } else if (operation.op === 'test') {
      test(updatedJson, operation)
    } else {
      throw new Error('Unknown JSONPatch operation ' + JSON.stringify(operation.op))
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

const PATCH_OPS = {
  add,
  remove,
  replace,
  copy,
  move
}

/**
 * Replace an existing item
 * @param {JSONData} json
 * @param {{ path: JSONPath, value: JSONData }} operation
 * @return {JSONData}
 */
export function replace (json, { path, value }) {
  return setIn(json, path, value)
}

/**
 * Remove an item or property
 * @param {JSONData} json
 * @param {{ path: JSONPath }} operation
 * @return {JSONData}
 */
export function remove (json, { path }) {
  return deleteIn(json, path)
}

/**
 * @param {JSONData} json
 * @param {{ path: JSONPath, value: JSONData }} operation
 * @return {JSONData}
 */
export function add (json, { path, value }) {
  if (isArrayItem(json, path)) {
    return insertAt(json, path, value)
  } else {
    return setIn(json, path, value)
  }
}

/**
 * Copy a value
 * @param {JSONData} json
 * @param {{ path: JSONPath, from: JSONPath }} operation
 * @return {JSONData}
 */
export function copy (json, { path, from }) {
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
 * @param {JSONData} json
 * @param {{ path: JSONPath, from: JSONPath }} operation
 * @return {JSONData}
 */
export function move (json, { path, from }) {
  const value = getIn(json, from)
  const removedJson = deleteIn(json, from)

  return isArrayItem(removedJson, path)
    ? insertAt(removedJson, path, value)
    : setIn(removedJson, path, value)
}

/**
 * Test whether the data contains the provided value at the specified path.
 * Throws an error when the test fails
 * @param {JSONData} json
 * @param {{ path: JSONPath, value: JSONData }} operation
 */
export function test (json, { path, value }) {
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

/**
 * @param {JSONData} json
 * @param {JSONPath} path
 * @returns {boolean}
 */
// TODO: write unit tests
export function isArrayItem (json, path) {
  const parent = getIn(json, initial(path))

  return Array.isArray(parent)
}

/**
 * Resolve the path index of an array, resolves indexes '-'
 * @param {JSONData} json
 * @param {JSONPath} path
 * @returns {JSONPath} Returns the resolved path
 */
export function resolvePathIndex (json, path) {
  if (last(path) !== '-') {
    return path
  }

  const parentPath = initial(path)
  const parent = getIn(json, parentPath)

  return parentPath.concat(parent.length)
}

/**
 * Validate a JSONPatch operation.
 * Throws an error when there is an issue
 * @param {JSONPatchOperation} operation
 */
export function validateJSONPatchOperation (operation) {
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

/**
 * @param {JSONData} json
 * @param {JSONPatchOperation} operation
 * @return {PreprocessedJSONPatchOperation}
 */
// TODO: write unit tests
export function preprocessJSONPatchOperation (json, operation) {
  return {
    op: operation.op,
    path: resolvePathIndex(json, parseJSONPointer(operation.path)),
    from: operation.from !== undefined
      ? parseJSONPointer(operation.from)
      : null,
    value: operation.value
  }
}
