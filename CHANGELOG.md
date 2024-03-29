# Changelog

## 2024-01-19, version 6.0.1

- Fix `Object.create(null)` not being recognized as object.


## 2023-12-13, version 6.0.0

- BREAKING: deprecated the `JSONValue` type, use generics instead.
- Implement generics, improving the TypeScript experience.
- Drop official support for Node.js 16.


## 2023-07-07, version 5.1.3

- Fix #2: the `main` field not pointing to the CommonJS version of the library.
- Fix UMD export not correctly exporting to `window.immutableJSONPatch` in the browser.
- Drop official support for Nodejs 14.


## 2023-01-12, version 5.1.2

- Add `exports` object to package.json to improve support different bundlers.


## 2022-11-17, version 5.1.1

- Fix helper function `existsIn` not handling recursive paths containing `null`.


## 2022-09-28, version 5.1.0

- Exports a new utility function `transform`.


## 2022-09-13, version 5.0.0

- BREAKING: Type `JSONData` has been renamed to `JSONValue`.
- BREAKING: The optional property `json` in the returned objects from callbacks 
  `JSONPatchOperations.before` and `RevertJSONPatchOptions.before` has been
  renamed to `document`.
- Fixed `isJSONObject` returning true for class instances.


## 2022-08-22, version 4.0.1

- Mark the package as side-effects free, allowing better optimization in 
  bundlers.


## 2022-08-22, version 4.0.0

- BREAKING: Changed the `"main"` field in `package.json` to point to
  the ES Module entry point instead of CommonJS.
- BREAKING: Converted the source code to TypeScript. There are some subtle
  changes in the TypeScript definitions of util functions.
- Implemented two new typeguard functions: `isJSONObject` and `isJSONArray`.


## 2022-07-01, version 3.0.0

- BREAKING: the `before` and `after` hooks of the function `immutableJSONPatch`
  now pass a `JSONPatchOperation` instead of a `PreprocessedJSONPatchOperation`.
- BREAKING: dropping function `parseJSONPointerWithArrayIndices` (introduced in
  v2.0.0) again, and changing `JSONPath` to always return an array with strings.
  Reason is that a mix of strings and numbers is fragile. It leads to bad usage
  patterns and can easily cause bugs.
- Implement a `before` callback for `revertJSONPatch`.
- Export utility functions `parsePath` and `parseFrom`, `isJSONPatchOperation`,
  `isJSONPatchAdd`, `isJSONPatchRemove`, `isJSONPatchReplace`, 
  `isJSONPatchCopy`, `isJSONPatchMove`, `isJSONPatchTest`.


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
