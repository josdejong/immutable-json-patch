const { strictEqual } = require('node:assert')
const cp = require('node:child_process')
const path = require('node:path')

describe('lib', () => {
  it('should load the library using ESM', (done) => {
    const filename = path.join(__dirname, 'apps/esmApp.mjs')

    cp.exec(`node ${filename}`, (error, result) => {
      strictEqual(error, null)
      strictEqual(result, "{ hello: 'world' }\n{}\n")
      done()
    })
  })

  it('should load the library using CJS', (done) => {
    const filename = path.join(__dirname, 'apps/cjsApp.cjs')

    cp.exec(`node ${filename}`, (error, result) => {
      strictEqual(error, null)
      strictEqual(result, "{ hello: 'world' }\n{}\n")
      done()
    })
  })

  it('should load the library using UMD bundle', (done) => {
    const filename = path.join(__dirname, 'apps/umdApp.cjs')

    cp.exec(`node ${filename}`, (error, result) => {
      strictEqual(error, null)
      strictEqual(result, "{ hello: 'world' }\n{}\n")
      done()
    })
  })

  it('should load the library using minified UMD bundle', (done) => {
    const filename = path.join(__dirname, 'apps/umdAppMin.cjs')

    cp.exec(`node ${filename}`, (error, result) => {
      strictEqual(error, null)
      strictEqual(result, "{ hello: 'world' }\n{}\n")
      done()
    })
  })
})
