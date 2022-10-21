const assert = require('assert')

const { sleep } = require('../lib/sleep')

describe('sleep', () => {
    describe('#sleep', () => {
        it('sleeps', async() => {
            await sleep(300)
            await sleep(300)
            await sleep(300)

            assert.ok(true, 'done')
        }).timeout(1000)
    })
})
