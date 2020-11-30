// To run:
//
//     $ node example.js

import { immutableJSONPatch, revertJSONPatch } from './lib/esm/index.js'

const json = {
  baz: 'qux',
  foo: 'bar'
}
console.log('json', json)

const operations = [
  { op: 'replace', path: '/baz', value: 'boo' },
  { op: 'add', path: '/hello', value: ['world'] },
  { op: 'remove', path: '/foo' }
]
console.log('operations', operations)

const updatedJson = immutableJSONPatch(json, operations)
console.log('updated json', updatedJson)
// updatedJson = {
//   "baz": "boo",
//   "hello": ["world"]
// }

const reverseOperations = revertJSONPatch(json, operations)
console.log('reverse operations', reverseOperations)
// reverseOperations = [
//   { op: 'add', path: '/foo', value: 'bar' },
//   { op: 'remove', path: '/hello' },
//   { op: 'replace', path: '/baz', value: 'qux' }
// ]

const revertedJson = immutableJSONPatch(updatedJson, reverseOperations)
console.log('reverted json', revertedJson)
// revertedJson = {
//   "baz": "qux",
//   "foo": "bar"
// }
