import assert from 'node:assert'
import {
  appendToJSONPointer,
  compileJSONPointer,
  compileJSONPointerProp,
  parseJSONPointer,
  startsWithJSONPointer
} from './jsonPointer.js'

describe('jsonPointer', () => {
  it('parseJSONPointer', () => {
    assert.deepStrictEqual(parseJSONPointer('/obj/a'), ['obj', 'a'])
    assert.deepStrictEqual(parseJSONPointer('/arr/-'), ['arr', '-'])
    assert.deepStrictEqual(parseJSONPointer('/foo/~1~0 ~0~1'), ['foo', '/~ ~/'])
    assert.deepStrictEqual(parseJSONPointer('/obj'), ['obj'])
    assert.deepStrictEqual(parseJSONPointer('/'), [''])
    assert.deepStrictEqual(parseJSONPointer(''), [])
  })

  it('compileJSONPointer', () => {
    assert.deepStrictEqual(compileJSONPointer(['foo', 'bar']), '/foo/bar')
    assert.deepStrictEqual(compileJSONPointer(['foo', 'bar baz']), '/foo/bar baz')
    assert.deepStrictEqual(compileJSONPointer(['foo', '/~ ~/']), '/foo/~1~0 ~0~1')
    assert.deepStrictEqual(compileJSONPointer(['']), '/')
    assert.deepStrictEqual(compileJSONPointer([]), '')
  })

  it('compileJSONPointerProp', () => {
    assert.deepStrictEqual(compileJSONPointerProp('foo'), '/foo')
    assert.deepStrictEqual(compileJSONPointerProp('/~ ~/'), '/~1~0 ~0~1')
    assert.deepStrictEqual(compileJSONPointerProp(''), '/')
  })

  it('appendToJSONPointer', () => {
    assert.deepStrictEqual(appendToJSONPointer('/obj', 'a'), '/obj/a')
    assert.deepStrictEqual(appendToJSONPointer('/foo', '/~ ~/'), '/foo/~1~0 ~0~1')
  })

  it('startsWithJSONPointer', () => {
    assert.deepStrictEqual(startsWithJSONPointer('/foo/bar', '/foo'), true)
    assert.deepStrictEqual(startsWithJSONPointer('/foo', '/bar'), false)
    assert.deepStrictEqual(startsWithJSONPointer('/foo/bar', '/foo/bar'), true)
    assert.deepStrictEqual(startsWithJSONPointer('/foo/bar', '/foo/bar/baz'), false)
    assert.deepStrictEqual(startsWithJSONPointer('/foofoo', '/foo'), false)
    assert.deepStrictEqual(startsWithJSONPointer('/foo/bar', ''), true)
  })
})
