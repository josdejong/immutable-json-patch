import { existsIn, getIn } from './immutabilityHelpers.js'
import {
  immutableJSONPatch,
  isArrayItem,
  parseFrom,
  parsePath
} from './immutableJSONPatch.js'
import { compileJSONPointer } from './jsonPointer.js'
import {
  JSONPatchAdd,
  JSONPatchDocument,
  JSONPatchMove, JSONPatchOperation, JSONPatchOptions,
  JSONPatchRemove,
  JSONPatchReplace,
  JSONPath,
  RevertJSONPatchOptions
} from './types.js'
import { startsWith } from './utils.js'

/**
 * Create the inverse of a set of json patch operations
 * @param document
 * @param operations Array with JSON patch actions
 * @param [options]
 * @return Returns the operations to revert the changes
 */
export function revertJSONPatch<T, U> (document: T, operations: JSONPatchDocument, options?: RevertJSONPatchOptions) : JSONPatchDocument {
  let allRevertOperations: JSONPatchDocument = []

  const before: JSONPatchOptions['before'] = <TT, UU>(document: TT, operation: JSONPatchOperation) : { document?: UU, operation?: JSONPatchOperation } => {
    let revertOperations: JSONPatchDocument
    const path = parsePath(document, operation.path)
    if (operation.op === 'add') {
      revertOperations = revertAdd(document, path)
    } else if (operation.op === 'remove') {
      revertOperations = revertRemove(document, path)
    } else if (operation.op === 'replace') {
      revertOperations = revertReplace(document, path)
    } else if (operation.op === 'copy') {
      revertOperations = revertCopy(document, path)
    } else if (operation.op === 'move') {
      revertOperations = revertMove(document, path, parseFrom(operation.from))
    } else if (operation.op === 'test') {
      revertOperations = []
    } else {
      throw new Error('Unknown JSONPatch operation ' + JSON.stringify(operation))
    }

    let updatedJson: UU
    if (options && options.before) {
      const res = options.before(document, operation, revertOperations)
      if (res && res.revertOperations) {
        revertOperations = res.revertOperations
      }
      if (res && res.document) {
        updatedJson = res.document as unknown as UU
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (res && res.json) {
        // TODO: deprecated since v5.0.0. Cleanup this warning some day
        throw new Error('Deprecation warning: returned object property ".json" has been renamed to ".document"')
      }
    }

    allRevertOperations = revertOperations.concat(allRevertOperations)

    if (updatedJson !== undefined) {
      return {
        document: updatedJson
      }
    }
  }

  immutableJSONPatch<U, T>(document, operations, { before })

  return allRevertOperations
}

function revertReplace<T> (document: T, path: JSONPath) : [JSONPatchReplace] {
  return [{
    op: 'replace',
    path: compileJSONPointer(path),
    value: getIn(document, path)
  }]
}

function revertRemove<T> (document: T, path: JSONPath) : [JSONPatchAdd] {
  return [{
    op: 'add',
    path: compileJSONPointer(path),
    value: getIn(document, path)
  }]
}

function revertAdd<T> (document: T, path: JSONPath) : [JSONPatchRemove] | [JSONPatchReplace] {
  if (isArrayItem(document, path) || !existsIn(document, path)) {
    return [{
      op: 'remove',
      path: compileJSONPointer(path)
    }]
  } else {
    return revertReplace(document, path)
  }
}

function revertCopy<T> (document: T, path: JSONPath) : [JSONPatchRemove] | [JSONPatchReplace] {
  return revertAdd(document, path)
}

function revertMove<T> (document: T, path: JSONPath, from: JSONPath) : [JSONPatchReplace] | [JSONPatchMove] | [JSONPatchMove, JSONPatchAdd] {
  if (path.length < from.length && startsWith(from, path)) {
    // replacing the parent with the child
    return [
      {
        op: 'replace',
        path: compileJSONPointer(path),
        value: document
      }
    ]
  }

  const move: JSONPatchMove = {
    op: 'move',
    from: compileJSONPointer(path),
    path: compileJSONPointer(from)
  }

  if (!isArrayItem(document, path) && existsIn(document, path)) {
    // the move replaces an existing value in an object
    return [
      move,
      ...revertRemove(document, path)
    ]
  } else {
    return [
      move
    ]
  }
}
