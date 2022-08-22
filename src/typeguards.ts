import {
  JSONPatchAdd,
  JSONPatchCopy,
  JSONPatchMove,
  JSONPatchOperation,
  JSONPatchRemove,
  JSONPatchReplace,
  JSONPatchTest
} from './types'

export function isJSONPatchOperation (value: unknown) : value is JSONPatchOperation {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? typeof value.op === 'string' : false
}

export function isJSONPatchAdd (value: unknown) : value is JSONPatchAdd {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? value.op === 'add' : false
}

export function isJSONPatchRemove (value: unknown) : value is JSONPatchRemove {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? value.op === 'remove' : false
}

export function isJSONPatchReplace (value) : value is JSONPatchReplace {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? value.op === 'replace' : false
}

export function isJSONPatchCopy (value) : value is JSONPatchCopy {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? value.op === 'copy' : false
}

export function isJSONPatchMove (value) : value is JSONPatchMove {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? value.op === 'move' : false
}

export function isJSONPatchTest (value) : value is JSONPatchTest {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value && typeof value === 'object' ? value.op === 'test' : false
}
