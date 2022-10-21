const assert = require('assert')

const { sleep } = require('../lib/sleep')
const { unrollOfLimit } = require('../lib/unrollOfLimit')

describe('unrollOfLimit', () => {
    it('produces the correct numbers', async() => {
        const generators = [
            [0],
            [1],
            [2]
        ]

        const items = []

        for await (const item of unrollOfLimit(generators)) {
            items.push(item)
        }

        items.sort()

        assert.deepEqual(items, [0, 1, 2], 'items are 0, 1, 2')
    })

    it('produces the correct numbers with delays', async() => {
        const gen = async function*(t, i) {
            await sleep(t)

            yield i
        }

        const generators = [
            gen(1, 0),
            gen(500, 1),
            gen(1, 2)
        ]

        const items = []

        for await (const item of unrollOfLimit(generators)) {
            items.push(item)
        }

        items.sort()

        assert.deepEqual(items, [0, 1, 2], 'items are 0, 1, 2')
    }).timeout(1000)
})
