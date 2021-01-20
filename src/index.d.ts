
export type JSONPath = (string | number)[]

export type JSONPatchOperationName = 'add' | 'remove' | 'replace' | 'copy' | 'move' | 'test'

export type JSONData = Object | Array<any> | number | string | boolean | null

export type JSONPatchOperation = {
  op: JSONPatchOperationName,
  path: string,
  from?: string,
  value?: any
}

export type PreprocessedJSONPatchOperation = {
  op: JSONPatchOperationName,
  path: JSONPath,
  from?: JSONPath,
  value?: any
}

export type JSONPatchDocument = JSONPatchOperation[]

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
