const assert = require('assert')

const { isIterable } = require('../lib/utils')

describe('utils', () => {
    describe('isIterable', () => {
        it('validates', () => {
            assert.ok(!isIterable(0), 'numbers are not iterables')
            assert.ok(!isIterable(1), 'numbers are not iterables')

            assert.ok(!isIterable(false), 'booleans are not iterables')
            assert.ok(!isIterable(true), 'booleans are not iterables')

            assert.ok(!isIterable(''), 'empty strings are not iterables')
            assert.ok(isIterable('abc'), 'non empty strings are iterables')
        })
    })
})
