const assert = require('assert')

const { sleep } = require('../lib/sleep')
const { iterateOfParallel } = require('../lib/iterateOfParallel')

describe('iterateOfParallel', () => {
    it('all at the same time', async() => {
        const items = []

        for await (let item of iterateOfParallel([0, 1, 2], async(item) => {
            await sleep((3 - item) * 100)

            return item
        })) {
            items.push(item)
        }

        assert.equal(items.length, 3, 'items.length is correct value')
    }).timeout(1000)

    it('one slow', async() => {
        const items = []

        for await (let item of iterateOfParallel([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], async(item) => {
            if (item === 0) {
                await sleep(1000)
            }

            return item
        })) {
            items.push(item)
        }

        assert.equal(items.length, 10, 'items.length is correct value')

        assert.equal(items[0], 1, 'items[0] is correct value')
        assert.equal(items[9], 0, 'items[9] is correct value')
    }).timeout(2000)

    it('with errors', async() => {
        const items = []

        let error

        try {
            for await (let item of iterateOfParallel([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], async(item) => {
                if (item === 5) {
                    throw new Error('Error')
                }

                return item
            })) {
                items.push(item)
            }
        }
        catch (e) {
            error = e
        }

        assert.ok(error, 'error registered')
    }).timeout(2000)
})
