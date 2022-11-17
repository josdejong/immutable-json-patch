/**
 * Immutability helpers
 *
 * inspiration:
 *
 * https://www.npmjs.com/package/seamless-immutable
 * https://www.npmjs.com/package/ih
 * https://www.npmjs.com/package/mutatis
 * https://github.com/mariocasciaro/object-path-immutable
 */
import { isJSONArray, isJSONObject } from './typeguards.js'
import type { JSONArray, JSONValue, JSONObject, JSONPath } from './types'
import { isObjectOrArray } from './utils.js'

/**
 * Shallow clone of an Object, Array, or value
 * Symbols are cloned too.
 */
export function shallowClone<T extends JSONValue> (value: T) : T {
  if (isJSONArray(value)) {
    // copy array items
    const copy: JSONArray = value.slice()

    // copy all symbols
    Object.getOwnPropertySymbols(value).forEach(symbol => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      copy[symbol] = value[symbol]
    })

    return copy as T
  } else if (isJSONObject(value)) {
    // copy object properties
    const copy: JSONObject = { ...value }

    // copy all symbols
    Object.getOwnPropertySymbols(value).forEach(symbol => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      copy[symbol] = value[symbol]
    })

    return copy as T
  } else {
    return value
  }
}

/**
 * Update a value in an object in an immutable way.
 * If the value is unchanged, the original object will be returned
 */
export function applyProp<T extends JSONObject | JSONArray> (object: T, key: string | number, value: JSONValue) : T {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (object[key] === value) {
    // return original object unchanged when the new value is identical to the old one
    return object
  } else {
    const updatedObject = shallowClone(object)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    updatedObject[key] = value
    return updatedObject
  }
}

/**
 * helper function to get a nested property in an object or array
 *
 * @return Returns the field when found, or undefined when the path doesn't exist
 */
export function getIn (object: JSONValue, path: JSONPath) : JSONValue | undefined {
  let value: JSONValue | undefined = object
  let i = 0

  while (i < path.length) {
    if (isJSONObject(value)) {
      value = value[path[i]]
    } else if (isJSONArray(value)) {
      value = value[parseInt(path[i])]
    } else {
      value = undefined
    }

    i++
  }

  return value
}

/**
 * helper function to replace a nested property in an object with a new value
 * without mutating the object itself.
 *
 * @param object
 * @param path
 * @param value
 * @param [createPath=false]
 *                    If true, `path` will be created when (partly) missing in
 *                    the object. For correctly creating nested Arrays or
 *                    Objects, the function relies on `path` containing number
 *                    in case of array indexes.
 *                    If false (default), an error will be thrown when the
 *                    path doesn't exist.
 * @return Returns a new, updated object or array
 */
export function setIn (object: JSONValue, path: JSONPath, value: JSONValue, createPath = false) : JSONValue {
  if (path.length === 0) {
    return value
  }

  const key = path[0]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const updatedValue = setIn(object ? object[key] : undefined, path.slice(1), value, createPath)

  if (isJSONObject(object) || isJSONArray(object)) {
    return applyProp(object, key, updatedValue)
  } else {
    if (createPath) {
      const newObject = IS_INTEGER_REGEX.test(key)
        ? []
        : {}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newObject[key] = updatedValue
      return newObject
    } else {
      throw new Error('Path does not exist')
    }
  }
}

const IS_INTEGER_REGEX = /^\d+$/

/**
 * helper function to replace a nested property in an object with a new value
 * without mutating the object itself.
 *
 * @return  Returns a new, updated object or array
 */
export function updateIn (object: JSONValue, path: JSONPath, callback: (value: JSONValue) => JSONValue) : JSONValue {
  if (path.length === 0) {
    return callback(object)
  }

  if (!isObjectOrArray(object)) {
    throw new Error('Path doesn\'t exist')
  }

  const key = path[0]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const updatedValue = updateIn(object[key], path.slice(1), callback)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return applyProp(object, key, updatedValue)
}

/**
 * helper function to delete a nested property in an object
 * without mutating the object itself.
 *
 * @return Returns a new, updated object or array
 */
export function deleteIn<T extends JSONValue> (object: T, path: JSONPath) : T {
  if (path.length === 0) {
    return object
  }

  if (!isObjectOrArray(object)) {
    throw new Error('Path does not exist')
  }

  if (path.length === 1) {
    const key = path[0]
    if (!(key in (object as object))) {
      // key doesn't exist. return object unchanged
      return object
    } else {
      const updatedObject = shallowClone(object)

      if (isJSONArray(updatedObject)) {
        updatedObject.splice(parseInt(key), 1)
      } if (isJSONObject(updatedObject)) {
        delete updatedObject[key]
      }

      return updatedObject
    }
  }

  const key = path[0]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const updatedValue = deleteIn(object[key], path.slice(1))
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return applyProp(object, key, updatedValue)
}

/**
 * Insert a new item in an array at a specific index.
 * Example usage:
 *
 *     insertAt({arr: [1,2,3]}, ['arr', '2'], 'inserted')  // [1,2,'inserted',3]
 */
export function insertAt (document: JSONObject | JSONArray, path: JSONPath, value: JSONValue) : JSONValue {
  const parentPath = path.slice(0, path.length - 1)
  const index = path[path.length - 1]

  return updateIn(document, parentPath, (items) => {
    if (!Array.isArray(items)) {
      throw new TypeError('Array expected at path ' + JSON.stringify(parentPath))
    }

    const updatedItems = shallowClone(items)
    updatedItems.splice(parseInt(index), 0, value)

    return updatedItems
  })
}

/**
 * Transform a JSON object, traverse over the whole object,
 * and allow replacing Objects/Arrays/values.
 */
export function transform (document: JSONValue, callback: (document: JSONValue, path: JSONPath) => JSONValue, path: JSONPath = []) : JSONValue {
  const updated1 = callback(document, path)

  if (isJSONArray(updated1)) { // array
    let updated2

    for (let i = 0; i < updated1.length; i++) {
      const before = updated1[i]
      // we stringify the index here, so the path only contains strings and can be safely
      // stringified/parsed to JSONPointer without loosing information.
      // We do not want to rely on path keys being numeric/string.
      const after = transform(before, callback, path.concat(i + ''))
      if (after !== before) {
        if (!updated2) {
          updated2 = shallowClone(updated1)
        }
        updated2[i] = after
      }
    }

    return updated2 || updated1
  } else if (isJSONObject(updated1)) { // object
    let updated2

    for (const key in updated1) {
      if (Object.hasOwnProperty.call(updated1, key)) {
        const before = updated1[key]
        const after = transform(before, callback, path.concat(key))
        if (after !== before) {
          if (!updated2) {
            updated2 = shallowClone(updated1)
          }
          updated2[key] = after
        }
      }
    }

    return updated2 || updated1
  } else { // number, string, boolean, null
    return updated1
  }
}

/**
 * Test whether a path exists in a JSON object
 * @return Returns true if the path exists, else returns false
 */
export function existsIn (document: JSONValue, path: JSONPath) : boolean {
  if (document === undefined) {
    return false
  }

  if (path.length === 0) {
    return true
  }

  if (document === null) {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return existsIn(document[path[0]], path.slice(1))
}
