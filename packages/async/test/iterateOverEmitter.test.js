const assert = require('assert')
const { EventEmitter } = require('events')

const { iterateOverEmitter } = require('../lib/iterateOverEmitter')

describe('iterateOverEmitter', () => {
    it('produces the correct numbers', async() => {
        const ee = new EventEmitter()

        setTimeout(() => {
            ee.emit('item', 0)
            ee.emit('item', 1)
            ee.emit('item', 2)
            ee.emit('end')
        }, 1)

        const items = []

        for await (const item of iterateOverEmitter(ee, 'item')) {
            items.push(item)
        }

        items.sort()

        assert.deepEqual(items, [0, 1, 2], 'items are 0, 1, 2')

        assert.equal(ee.listenerCount('item'), 0, 'item event cleared')
        assert.equal(ee.listenerCount('error'), 0, 'error event cleared')
        assert.equal(ee.listenerCount('end'), 0, 'end event cleared')
    })

    it('handles errors correctly', async() => {
        const ee = new EventEmitter()

        setTimeout(() => {
            ee.emit('item', 0)
            ee.emit('item', 1)
            ee.emit('error', new Error('test'))
            ee.emit('item', 2)
            ee.emit('end')
        }, 1)

        let error

        try {
            for await (const item of iterateOverEmitter(ee, 'item')) {
                item
            }
        }
        catch (e) {
            error = e
        }

        assert.equal(error.message, 'test', 'error detected')

        assert.equal(ee.listenerCount('item'), 0, 'item event cleared')
        assert.equal(ee.listenerCount('error'), 0, 'error event cleared')
        assert.equal(ee.listenerCount('end'), 0, 'end event cleared')
    })
})
