import assert from 'assert'
import { immutableJSONPatch } from './immutableJSONPatch.js'
import { revertJSONPatch } from './revertJSONPatch.js'

describe('immutableJSONPatch', () => {
  it('test strictEqual, notStrictEqual, deepStrictEqual', () => {
    const a = { x: 2 }
    const b = { x: 2 }

    // just to be sure the equality functions do what I think they do...
    assert.strictEqual(a, a)
    assert.notStrictEqual(b, a)
    assert.deepStrictEqual(b, a)
  })

  it('jsonpatch add', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 2 }
    }

    const operations = [
      { op: 'add', path: '/obj/b', value: { foo: 'bar' } }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 2, 3],
      obj: { a: 2, b: { foo: 'bar' } }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/obj/b' }
    ])
    assert.strictEqual(updatedJson.arr, json.arr)
  })

  it('jsonpatch add: insert in array', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 2 }
    }

    const operations = [
      { op: 'add', path: '/arr/1', value: 4 }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 4, 2, 3],
      obj: { a: 2 }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/arr/1' }
    ])
    assert.strictEqual(updatedJson.obj, json.obj)
  })

  it('jsonpatch add: append to array', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 2 }
    }

    const operations = [
      { op: 'add', path: '/arr/-', value: 4 }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 2, 3, 4],
      obj: { a: 2 }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/arr/3' }
    ])
    assert.strictEqual(updatedJson.obj, json.obj)
  })

  it('jsonpatch remove', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations = [
      { op: 'remove', path: '/obj/a' },
      { op: 'remove', path: '/arr/1' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 3],
      obj: {},
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'add', path: '/arr/1', value: 2 },
      { op: 'add', path: '/obj/a', value: 4 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, operations)
    assert.strictEqual(updatedJson.unchanged, json.unchanged)
  })

  it('jsonpatch replace', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations = [
      { op: 'replace', path: '/obj/a', value: 400 },
      { op: 'replace', path: '/arr/1', value: 200 }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 200, 3],
      obj: { a: 400 },
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'replace', path: '/arr/1', value: 2 },
      { op: 'replace', path: '/obj/a', value: 4 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, [
      { op: 'replace', path: '/obj/a', value: 400 },
      { op: 'replace', path: '/arr/1', value: 200 }
    ])
    assert.strictEqual(updatedJson.unchanged, json.unchanged)
  })

  it('jsonpatch replace root document', () => {
    const json = {
      a: 2
    }
    const operations = [
      { op: 'replace', path: '', value: { b: 3 } }
    ]
    const updatedJson = immutableJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, { b: 3 })
  })

  it('jsonpatch copy', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations = [
      { op: 'copy', from: '/obj', path: '/arr/2' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 2, { a: 4 }, 3],
      obj: { a: 4 }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/arr/2' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, [
      { op: 'add', path: '/arr/2', value: { a: 4 } }
    ])
    assert.strictEqual(updatedJson.obj, json.obj)
    assert.strictEqual(updatedJson.arr[2], json.obj)
  })

  it('jsonpatch move', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations = [
      { op: 'move', from: '/obj', path: '/arr/2' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 2, { a: 4 }, 3],
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/arr/2', path: '/obj' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, operations)
    assert.strictEqual(updatedJson.arr[2], json.obj)
    assert.strictEqual(updatedJson.unchanged, json.unchanged)
  })

  it('jsonpatch move down in array', () => {
    const json = ['A', 'B', 'C', 'D', 'E']

    const operations = [
      { op: 'move', from: '/1', path: '/3' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, ['A', 'C', 'D', 'B', 'E'])
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/3', path: '/1' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, operations)
  })

  it('jsonpatch move up in array', () => {
    const json = ['A', 'B', 'C', 'D', 'E']

    const operations = [
      { op: 'move', from: '/3', path: '/1' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, ['A', 'D', 'B', 'C', 'E'])
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/1', path: '/3' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, operations)
  })

  it('jsonpatch move and replace', () => {
    const json = { a: 2, b: 3 }

    const operations = [
      { op: 'move', from: '/a', path: '/b' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, { b: 2 })
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/b', path: '/a' },
      { op: 'add', path: '/b', value: 3 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, [
      { op: 'remove', path: '/b' },
      { op: 'move', from: '/a', path: '/b' }
    ])
  })

  it('jsonpatch move and replace (nested)', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations = [
      { op: 'move', from: '/obj', path: '/arr' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: { a: 4 },
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/arr', path: '/obj' },
      { op: 'add', path: '/arr', value: [1, 2, 3] }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedJson, revert)
    const revert2 = revertJSONPatch(updatedJson, revert)

    assert.deepStrictEqual(updatedJson2, json)
    assert.deepStrictEqual(revert2, [
      { op: 'remove', path: '/arr' },
      { op: 'move', from: '/obj', path: '/arr' }
    ])
    assert.strictEqual(updatedJson.unchanged, json.unchanged)
    assert.strictEqual(updatedJson2.unchanged, json.unchanged)
  })

  it('jsonpatch test (ok)', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations = [
      { op: 'test', path: '/arr', value: [1, 2, 3] },
      { op: 'add', path: '/added', value: 'ok' }
    ]

    const updatedJson = immutableJSONPatch(json, operations)
    const revert = revertJSONPatch(json, operations)

    assert.deepStrictEqual(updatedJson, {
      arr: [1, 2, 3],
      obj: { a: 4 },
      added: 'ok'
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/added' }
    ])
  })

  it('jsonpatch test (fail: path not found)', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations = [
      { op: 'test', path: '/arr/5', value: [1, 2, 3] },
      { op: 'add', path: '/added', value: 'ok' }
    ]

    assert.throws(() => revertJSONPatch(json, operations),
      new Error('Test failed: path not found (path: "/arr/5")'))

    assert.throws(() => immutableJSONPatch(json, operations),
      new Error('Test failed: path not found (path: "/arr/5")'))
  })

  it('jsonpatch test (fail: value not equal)', () => {
    const json = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations = [
      { op: 'test', path: '/obj', value: { a: 4, b: 6 } },
      { op: 'add', path: '/added', value: 'ok' }
    ]

    assert.throws(() => revertJSONPatch(json, operations),
      new Error('Test failed, value differs (path: "/obj")'))

    assert.throws(() => immutableJSONPatch(json, operations),
      new Error('Test failed, value differs (path: "/obj")'))
  })

  // TODO: write unit tests for the before and after callbacks
})
