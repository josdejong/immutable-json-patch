export type JSONPointer = string // a string containing a JSONPointer like '/array/3/name'
export type JSONPath = string[] // an array like ['array', '3', 'name']

export interface JSONPatchAdd {
  op: 'add'
  path: JSONPointer
  value: unknown
}

export interface JSONPatchRemove {
  op: 'remove'
  path: JSONPointer
}

export interface JSONPatchReplace {
  op: 'replace'
  path: JSONPointer
  value: unknown
}

export interface JSONPatchCopy {
  op: 'copy'
  path: JSONPointer
  from: JSONPointer
}

export interface JSONPatchMove {
  op: 'move'
  path: JSONPointer
  from: JSONPointer
}

export interface JSONPatchTest {
  op: 'test'
  path: JSONPointer
  value: unknown
}

export type JSONPatchOperation =
  | JSONPatchAdd
  | JSONPatchRemove
  | JSONPatchReplace
  | JSONPatchCopy
  | JSONPatchMove
  | JSONPatchTest

export type JSONPatchDocument = JSONPatchOperation[]

export type JSONPatchOptions = {
  before?: <T, U>(document: T, operation: JSONPatchOperation)
    => { document?: U, operation?: JSONPatchOperation }

  after?: <T, U, V>(document: T, operation: JSONPatchOperation, previousDocument: U)
    => V
}

export type RevertJSONPatchOptions = {
  before?: <T, U = T>(document: T, operation: JSONPatchOperation, revertOperations: JSONPatchOperation[])
    => { document?: U, revertOperations?: JSONPatchOperation[] }
}

/**
 * @deprecated use generics or `unknown` instead
 */
export type JSONPrimitive = string | number | boolean | null

/**
 * @deprecated use generics or `unknown` instead
 */
export type JSONValue =
  | { [key: string]: JSONValue } // object
  | JSONValue[] // array
  | JSONPrimitive // value

/**
 * @deprecated use generics or `unknown` instead
 */
export type JSONObject = { [key: string]: JSONValue }

/**
 * @deprecated use generics or `unknown` instead
 */
export type JSONArray = JSONValue[]
