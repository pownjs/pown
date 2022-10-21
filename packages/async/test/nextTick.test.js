const assert = require('assert')

const { nextTick } = require('../lib/nextTick')

describe('process', () => {
  describe('#nextTick', () => {
    it('ticks', async () => {
      await nextTick()
      await nextTick()
      await nextTick()

      assert.ok(true, 'done')
    })
  })
})
