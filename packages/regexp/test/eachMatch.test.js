const assert = require('assert')

const { eachMatch } = require('../lib/eachMatch')

describe('eachMatch', () => {
  it('produces results', () => {
    const results = []

    for (let result of eachMatch(/(.)/g, 'abc')) {
      results.push(result)
    }

    assert.equal(results.length, 3)
  })
})
