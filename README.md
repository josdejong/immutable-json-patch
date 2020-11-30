# immutable-json-patch

Immutable JSON patch with support for reverting operations.

Features:

- Apply JSON patch operations on a JSON document in an immutable way.
- Create inverse of the JSON patch operations to fully revert applied operations.
- Hook into the operations right before and after they are executed.

See http://jsonpatch.com/ for a clear description of the JSONPatch standard itself.

## Install

```
$ npm install immutable-json-patch
```

Note that in the `lib` folder, there are builds for ESM, UMD, and CommonJs.

## Load

ESM:

```js
import { immutableJSONPatch, revertJSONPatch } from 'immutable-json-patch'
```

CommonJs:

```js
const { immutableJSONPatch, revertJSONPatch } = require('immutable-json-patch')
```


## Use

Example from http://jsonpatch.com/#simple-example, using `immutable-json-patch`:

```js
import { immutableJSONPatch, revertJSONPatch } from 'immutable-json-patch'

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
```


### API

TODO: describe API


### Develop

To build the library (ESM, CommonJs, and UMD output in the folder `lib`):

```
$ npm install 
$ npm run build
```

To run the unit tests:

```
$ npm test
```

To run the linter (eslint):

```
$ npm run lint
```

To run the linter, build all, and run unit tests and integration tests:

```
$ npm run build-and-test
```


## License

Released under the [ISC license](LICENSE.md).
