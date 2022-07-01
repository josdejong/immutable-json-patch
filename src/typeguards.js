/**
 * @param {unknown} value
 * @return {boolean}
 */
export function isJSONPatchOperation (value) {
  return value ? typeof value.op === 'string' : false
}

/**
 * @param {unknown} operation
 * @return {boolean}
 */
export function isJSONPatchAdd (operation) {
  return operation ? operation.op === 'add' : false
}

/**
 * @param {unknown} operation
 * @return {boolean}
 */
export function isJSONPatchRemove (operation) {
  return operation ? operation.op === 'remove' : false
}

/**
 * @param {unknown} operation
 * @return {boolean}
 */
export function isJSONPatchReplace (operation) {
  return operation ? operation.op === 'replace' : false
}

/**
 * @param {unknown} operation
 * @return {boolean}
 */
export function isJSONPatchCopy (operation) {
  return operation ? operation.op === 'copy' : false
}

/**
 * @param {unknown} operation
 * @return {boolean}
 */
export function isJSONPatchMove (operation) {
  return operation ? operation.op === 'move' : false
}

/**
 * @param {unknown} operation
 * @return {boolean}
 */
export function isJSONPatchTest (operation) {
  return operation ? operation.op === 'test' : false
}
