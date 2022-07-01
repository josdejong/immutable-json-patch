
export type JSONPointer = string // a string containing a JSONPointer like '/array/3/name'
export type JSONPath = string[] // an array like ['array', '3', 'name']

export type JSONValue = string | number | boolean | null
export type JSONObject = { [key: string]: JSONData }
export type JSONArray = JSONData[]
export type JSONData = JSONObject | JSONArray | JSONValue

export interface JSONPatchAdd {
  op: 'add'
  path: JSONPointer
  value: JSONData
}

export interface JSONPatchRemove {
  op: 'remove'
  path: JSONPointer
}

export interface JSONPatchReplace {
  op: 'replace'
  path: JSONPointer
  value: JSONData
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
  value: JSONData
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
  before?: (json: JSONData, operation: JSONPatchOperation)
    => { json?: JSONData, operation?: JSONPatchOperation }

  after?: (json: JSONData, operation: JSONPatchOperation, previousJson: JSONData)
    => JSONData
}

export type RevertJSONPatchOptions = {
  before?: (json: JSONData, operation: JSONPatchOperation, revertOperations: JSONPatchOperation[])
    => { json?: JSONData, revertOperations?: JSONPatchOperation[] }
}

export declare function immutableJSONPatch(json: JSONData, operations: JSONPatchDocument, options?: JSONPatchOptions) : JSONData
export declare function revertJSONPatch(json: JSONData, operations: JSONPatchDocument, options?: RevertJSONPatchOptions) : JSONPatchDocument

// utils
export declare function parsePath(json: JSONData, pointer: JSONPointer) : JSONPath
export declare function parseFrom(fromPointer: JSONPointer) : JSONPath
export declare function parseJSONPointer(pointer: JSONPointer) : JSONPath
export declare function compileJSONPointer(path: JSONPath) : JSONPointer
export declare function compileJSONPointerProp(pathProp: string | number) : JSONPointer
export declare function appendToJSONPointer(pointer: JSONPointer, pathProp: string | number) : JSONPointer
export declare function startsWithJSONPointer(pointer: JSONPointer, searchPointer: JSONPointer) : boolean
export declare function isJSONPatchOperation(operation: unknown): operation is JSONPatchOperation
export declare function isJSONPatchAdd(operation: unknown): operation is JSONPatchAdd
export declare function isJSONPatchRemove(operation: unknown): operation is JSONPatchRemove
export declare function isJSONPatchReplace(operation: unknown): operation is JSONPatchReplace
export declare function isJSONPatchCopy(operation: unknown): operation is JSONPatchCopy
export declare function isJSONPatchMove(operation: unknown): operation is JSONPatchMove
export declare function isJSONPatchTest(operation: unknown): operation is JSONPatchTest
export declare function getIn(json: JSONData, path: JSONPath) : JSONData
export declare function setIn(json: JSONData, path: JSONPath, value: JSONData, createPath?: boolean) : JSONData
export declare function updateIn(json: JSONData, path: JSONPath, callback: (json: JSONData) => JSONData) : JSONData
export declare function deleteIn(json: JSONData, path: JSONPath) : JSONData
export declare function existsIn(json: JSONData, path: JSONPath) : boolean
export declare function insertAt(json: JSONData, path: JSONPath, value: JSONData) : JSONData
