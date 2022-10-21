const assert = require('assert')

const { sleep } = require('../lib/sleep')
const { eachOfParallel } = require('../lib/eachOfParallel')

describe('eachOfParallel', () => {
    it('1 at the time', async() => {
        const items = []

        await eachOfParallel([0, 1, 2], async(item) => {
            await sleep((3 - item) * 100)

            items.push(item)
        })

        assert.equal(items.length, 3, 'items.length is correct value')
    }).timeout(1000)

    it('all at the same time', async() => {
        const items = []

        await eachOfParallel([0, 1, 2], async(item) => {
            await sleep((3 - item) * 100)

            items.push(item)
        })

        assert.equal(items.length, 3, 'items.length is correct value')
    }).timeout(1000)

    it('one slow', async() => {
        const items = []

        await eachOfParallel([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], async(item) => {
            if (item === 0) {
                await sleep(1000)
            }

            items.push(item)
        })

        assert.equal(items.length, 10, 'items.length is correct value')

        assert.equal(items[0], 1, 'items[0] is correct value')
        assert.equal(items[9], 0, 'items[9] is correct value')
    }).timeout(2000)

    it('with error', async() => {
        const items = []

        let error

        try {
            await eachOfParallel([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], async(item) => {
                if (item === 5) {
                    throw new Error('Test')
                }

                items.push(item)
            })
        }
        catch (e) {
            error = e
        }

        assert.ok(error, 'error registered')
    }).timeout(2000)
})
