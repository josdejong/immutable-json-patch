export type JSONPointer = string // a string containing a JSONPointer like '/array/3/name'
export type JSONPath = string[] // an array like ['array', '3', 'name']

export type JSONPrimitive = string | number | boolean | null
export type JSONValue =
  | { [key: string]: JSONValue } // object
  | JSONValue[] // array
  | JSONPrimitive // value
export type JSONObject = { [key: string]: JSONValue }
export type JSONArray = JSONValue[]

/**
 * @deprecated JSONData has been renamed to JSONValue since v5.0.0
 */
export type JSONData = JSONValue

export interface JSONPatchAdd {
  op: 'add'
  path: JSONPointer
  value: JSONValue
}

export interface JSONPatchRemove {
  op: 'remove'
  path: JSONPointer
}

export interface JSONPatchReplace {
  op: 'replace'
  path: JSONPointer
  value: JSONValue
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
  value: JSONValue
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
  before?: (document: JSONValue, operation: JSONPatchOperation)
    => { document?: JSONValue, operation?: JSONPatchOperation }

  after?: (document: JSONValue, operation: JSONPatchOperation, previousDocument: JSONValue)
    => JSONValue
}

export type RevertJSONPatchOptions = {
  before?: (document: JSONValue, operation: JSONPatchOperation, revertOperations: JSONPatchOperation[])
    => { document?: JSONValue, revertOperations?: JSONPatchOperation[] }
}
