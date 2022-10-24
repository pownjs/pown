const assert = require('assert')
const jsYaml = require('js-yaml')
const path = require('path')
const fs = require('fs')

const { Pilot } = require('../lib/pilot')
const database = require('../lib/database')
const { compileDatabase } = require('../lib/compile')

describe('dataset', () => {
    it('viv-1615539741', async() => {
        const dataset = jsYaml.load(fs.readFileSync(path.join(__dirname, '..', 'dataset', 'viv-1615539741.yaml')))

        const lp = new Pilot({ database: compileDatabase(database) })

        for (let { valid, invalid } of dataset) {
            if (valid) {
                let lastMatch

                for await (const match of lp.iterateOverSearch(valid || invalid)) {
                    lastMatch = match
                }

                assert.ok(lastMatch, `Valid secret ${JSON.stringify(valid)} should match`)
            }
            else {
                let lastMatch

                for await (const match of lp.iterateOverSearch(valid || invalid)) {
                    lastMatch = match

                    if (match) {
                        break
                    }
                }

                assert.ok(!lastMatch, `Invalid secret ${JSON.stringify(invalid)} should not match ${JSON.stringify(lastMatch, '', '  ')}`)
            }
        }
    })
})
