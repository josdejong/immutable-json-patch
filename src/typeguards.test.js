import { strictEqual } from 'assert'
import {
  isJSONPatchAdd,
  isJSONPatchCopy,
  isJSONPatchMove,
  isJSONPatchOperation,
  isJSONPatchRemove,
  isJSONPatchReplace,
  isJSONPatchTest
} from './typeguards.js'

describe('typeguards', () => {
  const addOperation = { op: 'add', path: '/array/2', value: 42 }
  const removeOperation = { op: 'remove', path: '/array/2' }
  const replaceOperation = { op: 'replace', path: '/array/2', value: 42 }
  const copyOperation = { op: 'copy', from: '/array/4', path: '/array/2' }
  const moveOperation = { op: 'move', from: '/array/4', path: '/array/2' }
  const testOperation = { op: 'test', path: '/array/2', value: 42 }

  const tests = [
    { value: addOperation, operation: true, add: true, remove: false, replace: false, copy: false, move: false, test: false },
    { value: removeOperation, operation: true, add: false, remove: true, replace: false, copy: false, move: false, test: false },
    { value: replaceOperation, operation: true, add: false, remove: false, replace: true, copy: false, move: false, test: false },
    { value: copyOperation, operation: true, add: false, remove: false, replace: false, copy: true, move: false, test: false },
    { value: moveOperation, operation: true, add: false, remove: false, replace: false, copy: false, move: true, test: false },
    { value: testOperation, operation: true, add: false, remove: false, replace: false, copy: false, move: false, test: true },
    { value: undefined, operation: false, add: false, remove: false, replace: false, copy: false, move: false, test: false },
    { value: null, operation: false, add: false, remove: false, replace: false, copy: false, move: false, test: false },
    { value: {}, operation: false, add: false, remove: false, replace: false, copy: false, move: false, test: false },
    { value: 42, operation: false, add: false, remove: false, replace: false, copy: false, move: false, test: false }
  ]

  tests.forEach(({ value, operation, add, remove, replace, copy, move, test }) => {
    const valueStr = value ? JSON.stringify(value) : value

    it(`isJSONPatchOperation should return ${operation} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchOperation(value), operation)
    })

    it(`isJSONPatchAdd should return ${add} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchAdd(value), add)
    })

    it(`isJSONPatchRemove should return ${remove} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchRemove(value), remove)
    })

    it(`isJSONPatchReplace should return ${replace} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchReplace(value), replace)
    })

    it(`isJSONPatchCopy should return ${copy} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchCopy(value), copy)
    })

    it(`isJSONPatchMove should return ${move} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchMove(value), move)
    })

    it(`isJSONPatchTest should return ${test} for value ${valueStr}`, () => {
      strictEqual(isJSONPatchTest(value), test)
    })
  })
})
