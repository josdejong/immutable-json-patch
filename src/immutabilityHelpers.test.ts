import assert from 'node:assert'
import { expectTypeOf } from 'expect-type'
import {
  deleteIn,
  existsIn,
  getIn,
  insertAt,
  setIn,
  transform,
  updateIn
} from './immutabilityHelpers.js'

describe('immutabilityHelpers', () => {
  it('getIn', () => {
    const obj = {
      a: {
        b: {
          c: 2
        }
      },
      d: 3,
      e: [
        4,
        {
          f: 5,
          g: 6
        }
      ]
    }

    assert.deepStrictEqual(getIn(obj, ['a', 'b']), { c: 2 })
    assert.deepStrictEqual(getIn(obj, ['e', '1', 'f']), 5)
    assert.deepStrictEqual(getIn(obj, ['e', '999', 'f']), undefined)
    assert.deepStrictEqual(getIn(obj, ['non', 'existing', 'path']), undefined)
  })

  it('getIn in should handle null', () => {
    const document = [1, 2, 3, null]

    assert.deepStrictEqual(getIn(document, ['3']), null)
    assert.deepStrictEqual(getIn(document, ['3', 'prop']), undefined)
  })

  it('setIn basic', () => {
    const obj = {
      a: {
        b: {
          c: 2
        }
      },
      d: 3
    }

    const updated = setIn(obj, ['a', 'b', 'c'], 4)
    assert.deepStrictEqual(updated, {
      a: {
        b: {
          c: 4
        }
      },
      d: 3
    })

    // original should be unchanged
    assert.deepStrictEqual(obj, {
      a: {
        b: {
          c: 2
        }
      },
      d: 3
    })

    assert.notStrictEqual(obj, updated)
  })

  it('setIn non existing path', () => {
    const obj = {}

    assert.throws(() => setIn(obj, ['a', 'b', 'c'], 4), /Path does not exist/)
  })

  it('setIn non existing path with createPath=true', () => {
    const obj = {}

    assert.deepStrictEqual(setIn(obj, ['a', 'b', 'c'], 4, true), {
      a: {
        b: {
          c: 4
        }
      }
    })
    assert.deepStrictEqual(obj, {})
  })

  it('setIn non existing path with createPath=true and nested array', () => {
    const obj = {}

    const expected: { a: Record<string, number>[] } = {
      a: []
    }

    expected.a[2] = { c: 4 }

    assert.deepStrictEqual(setIn(obj, ['a', '2', 'c'], 4, true), expected)
    assert.deepStrictEqual(obj, {})
  })

  it('setIn replace value with object should throw an exception', () => {
    const obj = {
      a: 42,
      d: 3
    }

    assert.throws(() => setIn(obj, ['a', 'b', 'c'], 4), /Path does not exist/)
  })

  it('setIn replace value inside nested array', () => {
    const obj = {
      a: [
        1,
        2,
        {
          b: 3,
          c: 4
        }
      ],
      d: 5
    }

    const updated = setIn(obj, ['a', '2', 'c'], 8)

    assert.deepStrictEqual(updated, {
      a: [
        1,
        2,
        {
          b: 3,
          c: 8
        }
      ],
      d: 5
    })
  })

  it('setIn identical value should return the original object', () => {
    const obj = { a: 1, b: 2 }

    const updated = setIn(obj, ['b'], 2)

    assert.strictEqual(updated, obj)
  })

  it('setIn identical value should return the original object (2)', () => {
    const obj = { a: 1, b: { c: 2 } }

    const updated = setIn(obj, ['b', 'c'], 2)

    assert.strictEqual(updated, obj)
  })

  it('setIn with types', () => {
    interface UserWithoutId {
      name: string
    }

    interface User {
      id: string
      name: string
    }

    const newUser: UserWithoutId = { name: 'Joe' }
    const user: User = setIn(newUser, ['id'], '1234')
    assert.deepStrictEqual(user, { name: 'Joe', id: '1234' })
    expectTypeOf(setIn<User>(newUser, ['id'], '1234')).toExtend<User>()
    expectTypeOf(setIn<User, UserWithoutId>(newUser, ['id'], '1234')).toExtend<User>()
    expectTypeOf(setIn<User, UserWithoutId, string>(newUser, ['id'], '1234')).toExtend<User>()
  })

  it('updateIn', () => {
    const obj = {
      a: {
        b: {
          c: 2
        }
      },
      d: 3
    }

    const updated = updateIn(obj, ['a', 'b', 'c'], (value) => (value as number) + 100)
    assert.deepStrictEqual(updated, {
      a: {
        b: {
          c: 102
        }
      },
      d: 3
    })

    // original should be unchanged
    assert.deepStrictEqual(obj, {
      a: {
        b: {
          c: 2
        }
      },
      d: 3
    })

    assert.notStrictEqual(obj, updated)
  })

  it('updateIn (2)', () => {
    const obj = {
      a: {
        b: {
          c: 2
        }
      },
      d: 3
    }

    const updated = updateIn(obj, ['a', 'b'], () => [1, 2, 3])
    assert.deepStrictEqual(updated, {
      a: {
        b: [1, 2, 3]
      },
      d: 3
    })
  })

  it('updateIn (3)', () => {
    const obj = {
      a: {
        b: {
          c: 2
        }
      },
      d: 3
    }

    const updated = updateIn(obj, ['a', 'e'], (value) => `foo-${value}`)
    assert.deepStrictEqual(updated, {
      a: {
        b: {
          c: 2
        },
        e: 'foo-undefined'
      },
      d: 3
    })
  })

  it('updateIn return identical value should return the original object', () => {
    const obj = {
      a: 2,
      b: 3
    }

    const updated = updateIn(obj, ['b'], () => 3)
    assert.strictEqual(updated, obj)
  })

  it('deleteIn', () => {
    const obj = {
      a: {
        b: {
          c: 2,
          d: 3
        }
      },
      e: 4
    }

    const updated = deleteIn(obj, ['a', 'b', 'c'])
    assert.deepStrictEqual(updated, {
      a: {
        b: {
          d: 3
        }
      },
      e: 4
    })

    // original should be unchanged
    assert.deepStrictEqual(obj, {
      a: {
        b: {
          c: 2,
          d: 3
        }
      },
      e: 4
    })

    assert.notStrictEqual(obj, updated)
  })

  it('deleteIn array', () => {
    const obj = {
      a: {
        b: [1, { c: 2, d: 3 }, 4]
      },
      e: 5
    }

    const updated = deleteIn(obj, ['a', 'b', '1', 'c'])
    assert.deepStrictEqual(updated, {
      a: {
        b: [1, { d: 3 }, 4]
      },
      e: 5
    })

    // original should be unchanged
    assert.deepStrictEqual(obj, {
      a: {
        b: [1, { c: 2, d: 3 }, 4]
      },
      e: 5
    })

    assert.notStrictEqual(obj, updated)
  })

  it('deleteIn non existing path', () => {
    const obj = { a: {} }

    const updated = deleteIn(obj, ['a', 'b'])
    assert.strictEqual(updated, obj)
  })

  it('insertAt', () => {
    const obj = { a: [1, 2, 3] }

    const updated = insertAt(obj, ['a', '2'], 8)
    assert.deepStrictEqual(updated, { a: [1, 2, 8, 3] })
  })

  it('insertAt should copy symbols', () => {
    const symbol = Symbol('test symbol')
    const obj = { a: [1, 2, 3] }
    // @ts-ignore
    obj.a[symbol] = 'test'

    const updated = insertAt(obj, ['a', '2'], 8)

    const expected = { a: [1, 2, 8, 3] }
    // @ts-ignore
    expected.a[symbol] = 'test'
    assert.deepStrictEqual(updated, expected)
  })

  it('transform (no change)', () => {
    const document = { a: [1, 2, 3], b: { c: 4 } }
    const updated = transform(document, (value) => value)
    assert.strictEqual(updated, document)
  })

  it('transform (change based on value)', () => {
    const document = { a: [1, 2, 3], b: { c: 4 } }

    const updated = transform(document, (value) => (value === 2 ? 20 : value))
    const expected = { a: [1, 20, 3], b: { c: 4 } }

    assert.deepStrictEqual(updated, expected)
    assert.strictEqual(updated.b, document.b) // should not have replaced b
  })

  it('transform (change based on path)', () => {
    const document = { a: [1, 2, 3], b: { c: 4 } }

    const updated = transform(document, (value, path) => (path.join('.') === 'a.1' ? 20 : value))
    const expected = { a: [1, 20, 3], b: { c: 4 } }

    assert.deepStrictEqual(updated, expected)
    assert.strictEqual(updated.b, document.b) // should not have replaced b
  })

  it('existsIn', () => {
    const document = {
      obj: {
        arr: [1, 2, { first: 3, last: 4 }]
      },
      str: 'hello world',
      // @ts-ignore
      nothing: null,
      bool: false
    }

    assert.deepStrictEqual(existsIn(document, ['obj', 'arr', '2', 'first']), true)
    assert.deepStrictEqual(existsIn(document, ['obj', 'foo']), false)
    assert.deepStrictEqual(existsIn(document, ['obj', 'foo', 'bar']), false)
    assert.deepStrictEqual(existsIn(document, []), true)
  })

  it('exists in should handle null', () => {
    const document = [1, 2, 3, null]

    assert.deepStrictEqual(existsIn(document, ['3']), true)
    assert.deepStrictEqual(existsIn(document, ['3', 'prop']), false)
  })

  it('existsIn should find symbols', () => {
    const symbol = Symbol('mySymbol')

    const arrWithSymbol = [1, 2, 3]
    // @ts-ignore
    arrWithSymbol[symbol] = 'yes'

    // @ts-ignore
    assert.deepStrictEqual(existsIn(arrWithSymbol, [symbol]), true)

    // @ts-ignore
    assert.deepStrictEqual(existsIn([1, 2, 3], [symbol]), false)

    // @ts-ignore
    assert.deepStrictEqual(existsIn({ a: 1, [symbol]: 2 }, [symbol]), true)

    // @ts-ignore
    assert.deepStrictEqual(existsIn({ a: 1 }, [symbol]), false)
  })
})
