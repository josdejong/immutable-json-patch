# Changelog

## unpublished changes since version 2.0.1

- BREAKING: the `before` and `after` hooks of the function `immutableJSONPatch`
  now pass a `JSONPatchOperation` instead of a `PreprocessedJSONPatchOperation`.
- BREAKING: dropping function `parseJSONPointerWithArrayIndices` (introduced in
  v2.0.0) again, and changing `JSONPath` to always return an array with strings.
  Reason is that a mix of strings and numbers is fragile. It leads to bad usage
  patterns and can easily cause bugs.
- Implement a `before` callback for `revertJSONPatch`.
- Export utility functions `parsePath` and `parseFrom`.


## 2022-06-27, version 2.0.1

- Fix broken link to TypeScript definitions.


## 2022-06-27, version 2.0.0

- Improved TypeScript definitions (there are some breaking changes).
- Implemented new util functions: `compileJSONPointerProp`, 
  `startsWithJSONPointer`, `appendToJSONPointer`, 
  and `parseJSONPointerWithArrayIndices`.


## 2021-07-23, version 1.1.2

- Fix move operation from a nested property to the root not working when the
  root is an array.


## 2021-01-27, version 1.1.1

- Fix revert operation of operation `move` not correct when moving a child 
  object to the root.


## 2021-01-20, version 1.1.0

- Expose util functions `parseJSONPointer`, `compileJSONPointer`, `getIn`, 
  `setIn`, `updateIn`, `deleteIn`, `existsIn`, and `insertAt`.


## 2020-11-30, version 1.0.0

- Initial release.
