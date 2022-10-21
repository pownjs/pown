const assert = require('assert')

const { RegExp } = require('../lib/regexp')

describe('RegExp', () => {
    it('test', () => {
        const r = new RegExp('test', 'i')

        assert.ok(r.test('TEST'))
    })
})
