const assert = require('assert')

const { listNodeModules, list, extract, extractSync, hasNodeModule } = require('../lib/modules')

describe('lib', () => {
    describe('#listNodeModules', () => {
        it('must return list of pown modules', (done) => {
            listNodeModules((err, modules) => {
                assert.ok(err === null)
                assert.ok(modules.length > 0)

                done()
            })
        })

        it('must return list of pown modules (async/await)', async() => {
            const modules = await listNodeModules()

            assert.ok(modules.length > 0)
        })
    })

    describe('#listPownModules', () => {
        it('must return list of pown modules', (done) => {
            list((err, modules) => {
                assert.ok(err === null)
                assert.ok(modules.length === 0)

                done()
            })
        })

        it('must return list of pown modules (async/await)', async() => {
            const modules = await list()

            assert.ok(modules.length === 0)
        })
    })

    describe('#extract', () => {
        it('must extract list of pown modules', (done) => {
            extract((err, { loadableModules, loadableCommands, loadableTransforms }) => {
                assert.deepEqual(loadableModules, {})
                assert.deepEqual(loadableCommands, [])
                assert.deepEqual(loadableTransforms, [])

                done()
            })
        })

        it('must extract list of pown modules (async/await)', async() => {
            const { loadableModules, loadableCommands, loadableTransforms } = await extract()

            assert.deepEqual(loadableModules, {})
            assert.deepEqual(loadableCommands, [])
            assert.deepEqual(loadableTransforms, [])
        })
    })

    describe('#extractSync', () => {
        it('must extract list of pown modules', (done) => {
            const { loadableModules, loadableCommands, loadableTransforms } = extractSync()

            assert.deepEqual(loadableModules, {})
            assert.deepEqual(loadableCommands, [])
            assert.deepEqual(loadableTransforms, [])

            done()
        })
    })

    describe('#hasNodeModule', () => {
        it('must find http', () => {
            assert.ok(hasNodeModule('http') === true, 'http found')
        })

        it('must not find abc123', () => {
            assert.ok(hasNodeModule('abc123') !== true, 'abc123 not found')
        })
    })
})
