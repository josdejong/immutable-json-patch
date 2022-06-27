
export type JSONPath = (string | number)[]

export type JSONValue = string | number | boolean | null
export type JSONObject = { [key: string]: JSONData }
export type JSONArray = JSONData[]
export type JSONData = JSONObject | JSONArray | JSONValue

export interface JSONPatchAdd {
  op: 'add'
  path: string
  value: JSONData
}

export interface JSONPatchRemove {
  op: 'remove'
  path: string
}

export interface JSONPatchReplace {
  op: 'replace'
  path: string
  value: JSONData
}

export interface JSONPatchCopy {
  op: 'copy'
  path: string
  from: string
}

export interface JSONPatchMove {
  op: 'move'
  path: string
  from: string
}

export interface JSONPatchTest {
  op: 'test'
  path: string
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

export interface PreprocessedJSONPatchAdd {
  op: 'add'
  path: JSONPath
  value: JSONData
}

export interface PreprocessedJSONPatchRemove {
  op: 'remove'
  path: JSONPath
}

export interface PreprocessedJSONPatchReplace {
  op: 'replace'
  path: JSONPath
  value: JSONData
}

export interface PreprocessedJSONPatchCopy {
  op: 'copy'
  path: JSONPath
  from: JSONPath
}

export interface PreprocessedJSONPatchMove {
  op: 'move'
  path: JSONPath
  from: JSONPath
}

export interface PreprocessedJSONPatchTest {
  op: 'test'
  path: JSONPath
  value: JSONData
}

export type PreprocessedJSONPatchOperation =
  | PreprocessedJSONPatchAdd
  | PreprocessedJSONPatchRemove
  | PreprocessedJSONPatchReplace
  | PreprocessedJSONPatchCopy
  | PreprocessedJSONPatchMove
  | PreprocessedJSONPatchTest

export type JSONPatchOptions = {
  before?: (json: JSONData, operation: PreprocessedJSONPatchOperation)
    => { json?: JSONData, operation?: PreprocessedJSONPatchOperation } | undefined

  after?: (json: JSONData, operation: PreprocessedJSONPatchOperation, previousJson: JSONData)
    => JSONData | undefined
}

export declare function immutableJSONPatch (json: JSONData, operations: JSONPatchDocument, options?: JSONPatchOptions) : JSONData
export declare function revertJSONPatch (json: JSONData, operations: JSONPatchDocument) : JSONPatchDocument

// utils
export declare function parseJSONPointer (pointer: string) : JSONPath
export declare function compileJSONPointer (path: JSONPath) : string
export declare function getIn(json: JSONData, path: JSONPath) : JSONData
export declare function setIn(json: JSONData, path: JSONPath, value: JSONData, createPath?: boolean) : JSONData
export declare function updateIn(json: JSONData, path: JSONPath, callback: (json: JSONData) => JSONData) : JSONData
export declare function deleteIn(json: JSONData, path: JSONPath) : JSONData
export declare function existsIn(json: JSONData, path: JSONPath) : boolean
export declare function insertAt(json: JSONData, path: JSONPath, value: JSONData) : JSONData
