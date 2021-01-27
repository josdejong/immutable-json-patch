import assert from 'assert'
import { isEqual, startsWith } from './utils.js'

describe('utils', () => {
  it('test startsWith', () => {
    assert.strictEqual(startsWith([1, 2, 3], []), true)
    assert.strictEqual(startsWith([1, 2, 3], [1]), true)
    assert.strictEqual(startsWith([1, 2, 3], [1, 2]), true)
    assert.strictEqual(startsWith([1, 2, 3], [1, 2, 3]), true)
    assert.strictEqual(startsWith([1, 2, 3], [1, 2, 3, 4]), false)
    assert.strictEqual(startsWith([1, 2, 3], [1, 3]), false)
    assert.strictEqual(startsWith([1, 2, 3], [3]), false)
  })

  it('test startsWith with custom isEqual function', () => {
    const array1 = [{ id: 1 }, { id: 2 }]
    const array2 = [{ id: 1 }]

    assert.strictEqual(startsWith(array1, array2), false)
    assert.strictEqual(startsWith(array1, array2, isEqual), true)
  })
})
