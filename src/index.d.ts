
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
