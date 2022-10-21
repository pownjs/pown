const assert = require('assert')

const { idle } = require('../lib/idle')

describe('idle', () => {
    describe('#idle', () => {
        it('idles', async() => {
            await idle()
            await idle()
            await idle()

            assert.ok(true, 'done')
        }).timeout(1000)
    })
})
