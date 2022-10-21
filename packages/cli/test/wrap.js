const assert = require('assert')

const wrap = require('../lib/wrap')

describe('wrap', () => {
    it('should wrap', () => {
        assert(wrap(Array(100).fill('a').join(' ')).indexOf('\n') === 77)
    })
})
