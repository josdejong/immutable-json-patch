import { immutableJSONPatch, revertJSONPatch } from '../../lib/esm/index.js'

const document = {}
const operations = [
  { op: 'add', path: '/hello', value: 'world' }
]

const updatedJson = immutableJSONPatch(document, operations)
console.log(updatedJson)

const reverseOperations = revertJSONPatch(document, operations)
const revertedJson = immutableJSONPatch(updatedJson, reverseOperations)
console.log(revertedJson)
