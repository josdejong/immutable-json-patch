import assert from 'assert'
import { immutableJSONPatch, isArrayItem } from './immutableJSONPatch.js'
import { revertJSONPatch } from './revertJSONPatch.js'
import type { JSONPatchDocument } from './types'

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
    const document = {
      arr: [1, 2, 3],
      obj: { a: 2 }
    }

    const operations: JSONPatchDocument = [
      { op: 'add', path: '/obj/b', value: { foo: 'bar' } }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 2, 3],
      obj: { a: 2, b: { foo: 'bar' } }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/obj/b' }
    ])
    assert.strictEqual(updatedDocument.arr, document.arr)
  })

  it('jsonpatch add: insert in array', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 2 }
    }

    const operations: JSONPatchDocument = [
      { op: 'add', path: '/arr/1', value: 4 }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 4, 2, 3],
      obj: { a: 2 }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/arr/1' }
    ])
    assert.strictEqual(updatedDocument.obj, document.obj)
  })

  it('jsonpatch add: append to array', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 2 }
    }

    const operations: JSONPatchDocument = [
      { op: 'add', path: '/arr/-', value: 4 }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 2, 3, 4],
      obj: { a: 2 }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/arr/3' }
    ])
    assert.strictEqual(updatedDocument.obj, document.obj)
  })

  it('jsonpatch remove', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations: JSONPatchDocument = [
      { op: 'remove', path: '/obj/a' },
      { op: 'remove', path: '/arr/1' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 3],
      obj: {},
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'add', path: '/arr/1', value: 2 },
      { op: 'add', path: '/obj/a', value: 4 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, operations)
    assert.strictEqual(updatedDocument.unchanged, document.unchanged)
  })

  it('jsonpatch remove multiple items from an array', () => {
    const document = [0, 1, 2, 3, 4]

    const operations: JSONPatchDocument = [
      { op: 'remove', path: '/2' },
      { op: 'remove', path: '/2' },
      { op: 'remove', path: '/2' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, [0, 1])
    assert.deepStrictEqual(revert, [
      { op: 'add', path: '/2', value: 4 },
      { op: 'add', path: '/2', value: 3 },
      { op: 'add', path: '/2', value: 2 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, operations)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(updatedDocument.unchanged, document.unchanged)
  })

  it('jsonpatch remove multiple items from an array in reverse order', () => {
    const document = [0, 1, 2, 3, 4]

    const operations: JSONPatchDocument = [
      { op: 'remove', path: '/4' },
      { op: 'remove', path: '/3' },
      { op: 'remove', path: '/2' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, [0, 1])
    assert.deepStrictEqual(revert, [
      { op: 'add', path: '/2', value: 2 },
      { op: 'add', path: '/3', value: 3 },
      { op: 'add', path: '/4', value: 4 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, operations)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(updatedDocument.unchanged, document.unchanged)
  })

  it('jsonpatch replace', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations: JSONPatchDocument = [
      { op: 'replace', path: '/obj/a', value: 400 },
      { op: 'replace', path: '/arr/1', value: 200 }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 200, 3],
      obj: { a: 400 },
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'replace', path: '/arr/1', value: 2 },
      { op: 'replace', path: '/obj/a', value: 4 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'replace', path: '/obj/a', value: 400 },
      { op: 'replace', path: '/arr/1', value: 200 }
    ])
    assert.strictEqual(updatedDocument.unchanged, document.unchanged)
  })

  it('jsonpatch replace root document', () => {
    const document = {
      a: 2
    }
    const operations: JSONPatchDocument = [
      { op: 'replace', path: '', value: { b: 3 } }
    ]
    const updatedDocument = immutableJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, { b: 3 })
  })

  it('jsonpatch copy', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations: JSONPatchDocument = [
      { op: 'copy', from: '/obj', path: '/arr/2' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 2, { a: 4 }, 3],
      obj: { a: 4 }
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/arr/2' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'add', path: '/arr/2', value: { a: 4 } }
    ])
    assert.strictEqual(updatedDocument.obj, document.obj)
    assert.strictEqual(updatedDocument.arr[2], document.obj)
  })

  it('jsonpatch copy from child to parent', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations: JSONPatchDocument = [
      { op: 'copy', from: '/obj', path: '' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, { a: 4 })
    assert.deepStrictEqual(revert, [
      { op: 'replace', path: '', value: document }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'replace', path: '', value: { a: 4 } }
    ])
  })

  it('jsonpatch move', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/obj', path: '/arr/2' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 2, { a: 4 }, 3],
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/arr/2', path: '/obj' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, operations)
    assert.strictEqual(updatedDocument.arr[2], document.obj)
    assert.strictEqual(updatedDocument.unchanged, document.unchanged)
  })

  it('jsonpatch move down in array', () => {
    const document = ['A', 'B', 'C', 'D', 'E']

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/1', path: '/3' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, ['A', 'C', 'D', 'B', 'E'])
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/3', path: '/1' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, operations)
  })

  it('jsonpatch move up in array', () => {
    const document = ['A', 'B', 'C', 'D', 'E']

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/3', path: '/1' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, ['A', 'D', 'B', 'C', 'E'])
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/1', path: '/3' }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, operations)
  })

  it('jsonpatch move and replace', () => {
    const document = { a: 2, b: 3 }

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/a', path: '/b' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, { b: 2 })
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/b', path: '/a' },
      { op: 'add', path: '/b', value: 3 }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'remove', path: '/b' },
      { op: 'move', from: '/a', path: '/b' }
    ])
  })

  it('jsonpatch move and replace (nested)', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/obj', path: '/arr' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: { a: 4 },
      unchanged: {}
    })
    assert.deepStrictEqual(revert, [
      { op: 'move', from: '/arr', path: '/obj' },
      { op: 'add', path: '/arr', value: [1, 2, 3] }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'remove', path: '/arr' },
      { op: 'move', from: '/obj', path: '/arr' }
    ])
    assert.strictEqual(updatedDocument.unchanged, document.unchanged)
    assert.strictEqual(updatedJson2.unchanged, document.unchanged)
  })

  it('jsonpatch move and replace (extract object)', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 },
      unchanged: {}
    }

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/obj', path: '' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, { a: 4 })
    assert.deepStrictEqual(revert, [
      { op: 'replace', path: '', value: document }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'replace', path: '', value: { a: 4 } }
    ])
  })

  it('jsonpatch move and replace (extract array)', () => {
    const document = [1, 2, 3]

    const operations: JSONPatchDocument = [
      { op: 'move', from: '/2', path: '' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, 3)
    assert.deepStrictEqual(revert, [
      { op: 'replace', path: '', value: document }
    ])

    // test revert
    const updatedJson2 = immutableJSONPatch(updatedDocument, revert)
    const revert2 = revertJSONPatch(updatedDocument, revert)

    assert.deepStrictEqual(updatedJson2, document)
    assert.deepStrictEqual(revert2, [
      { op: 'replace', path: '', value: 3 }
    ])
  })

  // TODO: make robust against this
  it.skip('jsonpatch should throw an error when moving parent to child', () => {
    // const document = {
    //   obj: { a: 4 }
    // }
    //
    // const operations: JSONPatchDocument = [
    //   { op: 'move', from: '', path: '/obj/b' }
    // ]
    //
    // const updatedDocument = immutableJSONPatch(document, operations)
    // const revert = revertJSONPatch(document, operations)
  })

  it('jsonpatch test (ok)', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations: JSONPatchDocument = [
      { op: 'test', path: '/arr', value: [1, 2, 3] },
      { op: 'add', path: '/added', value: 'ok' }
    ]

    const updatedDocument = immutableJSONPatch(document, operations)
    const revert = revertJSONPatch(document, operations)

    assert.deepStrictEqual(updatedDocument, {
      arr: [1, 2, 3],
      obj: { a: 4 },
      added: 'ok'
    })
    assert.deepStrictEqual(revert, [
      { op: 'remove', path: '/added' }
    ])
  })

  it('jsonpatch test (fail: path not found)', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations: JSONPatchDocument = [
      { op: 'test', path: '/arr/5', value: [1, 2, 3] },
      { op: 'add', path: '/added', value: 'ok' }
    ]

    assert.throws(() => revertJSONPatch(document, operations),
      new Error('Test failed: path not found (path: "/arr/5")'))

    assert.throws(() => immutableJSONPatch(document, operations),
      new Error('Test failed: path not found (path: "/arr/5")'))
  })

  it('jsonpatch test (fail: value not equal)', () => {
    const document = {
      arr: [1, 2, 3],
      obj: { a: 4 }
    }

    const operations: JSONPatchDocument = [
      { op: 'test', path: '/obj', value: { a: 4, b: 6 } },
      { op: 'add', path: '/added', value: 'ok' }
    ]

    assert.throws(() => revertJSONPatch(document, operations),
      new Error('Test failed, value differs (path: "/obj")'))

    assert.throws(() => immutableJSONPatch(document, operations),
      new Error('Test failed, value differs (path: "/obj")'))
  })

  it('should check whether a path is an array item', () => {
    assert.strictEqual(isArrayItem({ a: 2 }, ['a']), false)
    assert.strictEqual(isArrayItem([1, 2, 3], ['0']), true)
    assert.strictEqual(isArrayItem([1, 2, 3], []), false)
  })

  // TODO: write unit tests for the before and after callbacks
})
