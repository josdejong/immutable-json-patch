export type JSONPointer = string // a string containing a JSONPointer like '/array/3/name'
export type JSONPath = string[] // an array like ['array', '3', 'name']

export type JSONValue = string | number | boolean | null
export type JSONData = { [key: string]: JSONData } | JSONData[] | JSONValue
export type JSONObject = { [key: string]: JSONData }
export type JSONArray = JSONData[]

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
