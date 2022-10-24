const assert = require('assert')

const { Pilot } = require('../lib/pilot')
const { compileCollection } = require('../lib/compile')

describe('Pilot', () => {
  describe('#iterateOverSearch', () => {
    it('must not produce results', async () => {
      const database = {}

      const lp = new Pilot({ database })

      const results = []

      for await (const match of lp.iterateOverSearch('')) {
        results.push(match)
      }

      assert.ok(results.length === 0)
    })

    it('must produce results', async () => {
      const database = {
        test: compileCollection({
          checks: [
            {
              regex: /secret/g,
            },
          ],
        }),
      }

      const lp = new Pilot({ database })

      const results = []

      for await (const match of lp.iterateOverSearch(
        'a b secret c secret x secret y z'
      )) {
        results.push(match)
      }

      assert.ok(results.length === 3)
      assert.ok(results.every((result) => result.index > 0))
    })

    it('must produce results with groups', async () => {
      const database = {
        test: compileCollection({
          checks: [
            {
              regex: /secret\d+/g,
            },
          ],
        }),
      }

      const lp = new Pilot({ database })

      const results = []

      for await (const match of lp.iterateOverSearch(
        'a b secret1 c secret2 x secret3 y z'
      )) {
        results.push(match)
      }

      assert.ok(results.length === 3)
      assert.ok(results.every((result) => result.index > 0))
      assert.deepEqual(
        results.map((result) => result.find),
        ['secret1', 'secret2', 'secret3']
      )
    })
  })

  describe('#iterateOverSearchPerCodeLine', () => {
    it('must produce results with groups', async () => {
      const database = {
        test: compileCollection({
          checks: [
            {
              regex: /secret\d+/g,
            },
          ],
        }),
      }

      const lp = new Pilot({ database })

      const results = []

      for await (const match of lp.iterateOverSearchPerCodeLine(
        'a\nb\nsecret1\nc\nsecret2\nx\nsecret3\ny\nz'
      )) {
        results.push(match)
      }

      assert.ok(results.length === 3)
      assert.ok(results.every((result) => result.index > 0))
      assert.deepEqual(
        results.map((result) => result.find),
        ['secret1', 'secret2', 'secret3']
      )
    })

    it('must produce results with groups', async () => {
      const database = {
        test: compileCollection({
          checks: [
            {
              regex: /secret\d+/g,
            },
          ],
        }),
      }

      const lp = new Pilot({ database })

      const results = []

      for await (const match of lp.iterateOverSearchPerCodeLine(
        'a;b;secret1;c;secret2;x;secret3;y;z'
      )) {
        results.push(match)
      }

      assert.ok(results.length === 3)
      assert.ok(results.every((result) => result.index > 0))
      assert.deepEqual(
        results.map((result) => result.find),
        ['secret1', 'secret2', 'secret3']
      )
    })

    it('must trim line', async () => {
      const database = {
        test: compileCollection({
          checks: [
            {
              regex: /secret\d+/g,
            },
          ],
        }),
      }

      const lp = new Pilot({ database })

      const secret1 = 'secret' + Array(1024).fill('0').join('')

      const results = []

      for await (const match of lp.iterateOverSearchPerCodeLine(
        Array(1024).fill('a').join('') +
          ';b;' +
          secret1 +
          ';' +
          Array(1024).fill('c').join('')
      )) {
        results.push(match)
      }

      assert.ok(results.length === 1)
      assert.ok(results.every((result) => result.index > 0))
      assert.deepEqual(
        results.map((result) => result.find),
        [secret1]
      )
    })
  })
})
