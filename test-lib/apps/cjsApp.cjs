const { immutableJSONPatch, revertJSONPatch } = require('../../lib/cjs')

const json = {}
const operations = [
  { op: 'add', path: '/hello', value: 'world' }
]

const updatedJson = immutableJSONPatch(json, operations)
console.log(updatedJson)

const reverseOperations = revertJSONPatch(json, operations)
const revertedJson = immutableJSONPatch(updatedJson, reverseOperations)
console.log(revertedJson)
