import { existsIn, getIn } from './immutabilityHelpers.js'
import {
  immutableJSONPatch,
  isArrayItem,
  parseFrom,
  parsePath
} from './immutableJSONPatch.js'
import { compileJSONPointer } from './jsonPointer.js'
import type {
  JSONData,
  JSONPatchAdd,
  JSONPatchDocument,
  JSONPatchMove,
  JSONPatchRemove,
  JSONPatchReplace,
  JSONPath,
  RevertJSONPatchOptions
} from './types.js'
import { startsWith } from './utils.js'

/**
 * Create the inverse of a set of json patch operations
 * @param json
 * @param operations Array with JSON patch actions
 * @param [options]
 * @return Returns the operations to revert the changes
 */
export function revertJSONPatch (json: JSONData, operations: JSONPatchDocument, options?: RevertJSONPatchOptions) : JSONPatchDocument {
  let allRevertOperations: JSONPatchDocument = []

  immutableJSONPatch(json, operations, {
    before: (json, operation) => {
      let revertOperations: JSONPatchDocument
      const path = parsePath(json, operation.path)
      if (operation.op === 'add') {
        revertOperations = revertAdd(json, path)
      } else if (operation.op === 'remove') {
        revertOperations = revertRemove(json, path)
      } else if (operation.op === 'replace') {
        revertOperations = revertReplace(json, path)
      } else if (operation.op === 'copy') {
        revertOperations = revertCopy(json, path)
      } else if (operation.op === 'move') {
        revertOperations = revertMove(json, path, parseFrom(operation.from))
      } else if (operation.op === 'test') {
        revertOperations = []
      } else {
        throw new Error('Unknown JSONPatch operation ' + JSON.stringify(operation))
      }

      let updatedJson
      if (options && options.before) {
        const res = options.before(json, operation, revertOperations)
        if (res && res.revertOperations) {
          revertOperations = res.revertOperations
        }
        if (res && res.json) {
          updatedJson = res.json
        }
      }

      allRevertOperations = revertOperations.concat(allRevertOperations)

      if (updatedJson !== undefined) {
        return {
          json: updatedJson
        }
      }
    }
  })

  return allRevertOperations
}

function revertReplace (json: JSONData, path: JSONPath) : [JSONPatchReplace] {
  return [{
    op: 'replace',
    path: compileJSONPointer(path),
    value: getIn(json, path)
  }]
}

function revertRemove (json: JSONData, path: JSONPath) : [JSONPatchAdd] {
  return [{
    op: 'add',
    path: compileJSONPointer(path),
    value: getIn(json, path)
  }]
}

function revertAdd (json: JSONData, path: JSONPath) : [JSONPatchRemove] | [JSONPatchReplace] {
  if (isArrayItem(json, path) || !existsIn(json, path)) {
    return [{
      op: 'remove',
      path: compileJSONPointer(path)
    }]
  } else {
    return revertReplace(json, path)
  }
}

function revertCopy (json: JSONData, path: JSONPath) : [JSONPatchRemove] | [JSONPatchReplace] {
  return revertAdd(json, path)
}

function revertMove (json: JSONData, path: JSONPath, from: JSONPath) : [JSONPatchReplace] | [JSONPatchMove] | [JSONPatchMove, JSONPatchAdd] {
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

  const move: JSONPatchMove = {
    op: 'move',
    from: compileJSONPointer(path),
    path: compileJSONPointer(from)
  }

  if (!isArrayItem(json, path) && existsIn(json, path)) {
    // the move replaces an existing value in an object
    return [
      move,
      ...revertRemove(json, path)
    ]
  } else {
    return [
      move
    ]
  }
}
