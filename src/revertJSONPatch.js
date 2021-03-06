import { existsIn, getIn } from './immutabilityHelpers.js'
import { immutableJSONPatch, isArrayItem } from './immutableJSONPatch.js'
import { compileJSONPointer } from './jsonPointer.js'
import { startsWith } from './utils.js'

/**
 * Create the inverse of a set of json patch operations
 * @param {JSONData} json
 * @param {JSONPatchDocument} operations    Array with JSON patch actions
 * @return {JSONPatchDocument} Returns the operations to revert the changes
 */
export function revertJSONPatch (json, operations) {
  let revertOperations = []

  immutableJSONPatch(json, operations, {
    before: (json, operation) => {
      const revertOp = REVERT_OPS[operation.op]
      if (revertOp) {
        revertOperations = revertOp(json, operation).concat(revertOperations)
      }
    }
  })

  return revertOperations
}

const REVERT_OPS = {
  add: revertAdd,
  remove: revertRemove,
  replace: revertReplace,
  copy: revertCopy,
  move: revertMove
}

/**
 * @param {JSONData} json
 * @param {{ path: JSONPath }} operation
 * @return {JSONPatchDocument}
 */
function revertReplace (json, { path }) {
  return [{
    op: 'replace',
    path: compileJSONPointer(path),
    value: getIn(json, path)
  }]
}

/**
 * @param {JSONData} json
 * @param {{ path: JSONPath }} operation
 * @return {JSONPatchDocument}
 */
function revertRemove (json, { path }) {
  return [{
    op: 'add',
    path: compileJSONPointer(path),
    value: getIn(json, path)
  }]
}

/**
 * @param {JSONData} json
 * @param {{ path: JSONPath, value: JSONData }} operation
 * @return {JSONPatchDocument}
 */
function revertAdd (json, { path, value }) {
  if (isArrayItem(json, path) || !existsIn(json, path)) {
    return [{
      op: 'remove',
      path: compileJSONPointer(path)
    }]
  } else {
    return revertReplace(json, { path, value })
  }
}

/**
 * @param {JSONData} json
 * @param {{ path: JSONPath, value: JSONData }} operation
 * @return {JSONPatchDocument}
 */
function revertCopy (json, { path, value }) {
  return revertAdd(json, { path, value })
}

/**
 * @param {JSONData} json
 * @param {{ path: JSONPath, from: JSONPath }} operation
 * @return {JSONPatchDocument}
 */
function revertMove (json, { path, from }) {
  if (path.length < from.length && startsWith(from, path)) {
    // replacing the parent with the child
    return [
      {
        op: 'replace',
        path: compileJSONPointer(path),
        value: json
      }
    ]
  }

  let revert = [
    {
      op: 'move',
      from: compileJSONPointer(path),
      path: compileJSONPointer(from)
    }
  ]

  if (!isArrayItem(json, path) && existsIn(json, path)) {
    // the move replaces an existing value in an object
    revert = revert.concat(revertRemove(json, { path }))
  }

  return revert
}
