// To run:
//
//     $ node example.js

import { immutableJSONPatch, revertJSONPatch } from './lib/esm/index.js'

const document = {
  baz: 'qux',
  foo: 'bar'
}
console.log('document', document)

const operations = [
  { op: 'replace', path: '/baz', value: 'boo' },
  { op: 'add', path: '/hello', value: ['world'] },
  { op: 'remove', path: '/foo' }
]
console.log('operations', operations)

const updatedDocument = immutableJSONPatch(document, operations)
console.log('updatedDocument', updatedDocument)
// updatedDocument = {
//   "baz": "boo",
//   "hello": ["world"]
// }

const reverseOperations = revertJSONPatch(document, operations)
console.log('reverseOperations', reverseOperations)
// reverseOperations = [
//   { op: 'add', path: '/foo', value: 'bar' },
//   { op: 'remove', path: '/hello' },
//   { op: 'replace', path: '/baz', value: 'qux' }
// ]

const revertedDocument = immutableJSONPatch(updatedDocument, reverseOperations)
console.log('revertedDocument', revertedDocument)
// revertedDocument = {
//   "baz": "qux",
//   "foo": "bar"
// }
