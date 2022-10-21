const assert = require('assert')

const colors = require('../lib/colors')

describe('colors', () => {
  it('should color', () => {
    assert(colors.red('test').length > 0)
  })
})
