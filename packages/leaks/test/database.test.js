const fs = require('fs')
const path = require('path')
const assert = require('assert')
const jsYaml = require('js-yaml')
const safeRegex = require('safe-regex')

const { compileDatabase } = require('../lib/compile')

describe('database', () => {
    const databaseRoot = path.join(__dirname, '..', 'database')

    const database = compileDatabase(Object.assign({}, ...fs.readdirSync(databaseRoot).map((file) => {
        const doc = jsYaml.load(fs.readFileSync(path.join(databaseRoot, file)).toString())

        const { variables = {}, checks = [] } = doc

        for (let check of checks) {
            Object.entries(variables).forEach(([name, value]) => {
                if (check.regex) {
                    check.regex = check.regex.split('${' + name + '}').join(value)
                }

                if (check.filterRegex) {
                    check.filterRegex = check.filterRegex.split('${' + name + '}').join(value)
                }
            })
        }

        return {
            [path.basename(file, '.yaml')]: doc
        }
    })))

    it('database is ok', () => {
        assert.ok(database, 'database exists')

        Object.entries(database).forEach(([name, { checks }]) => {
            checks.forEach((check, index) => {
                assert.ok(check.title, `title exists for ${name}.${index}`)
            })
        })
    })

    it('database checks validate', () => {
        const first = (it) => Array.from(it)[0]

        Object.entries(database).forEach(([name, { variables = {}, checks = [] }]) => {
            checks.forEach((check) => {
                let { title, regex, filterRegex, test, tests = [], safe = true } = check

                assert.ok(!test, `${JSON.stringify(title)} has incorrect test declaration`)

                if (tests) {
                    const { positive, negative } = tests

                    if (positive) {
                        const { scan } = check

                        positive.forEach((test, index) => {
                            const result = first(scan(test))

                            assert.ok(result, `${JSON.stringify(title)} validates against positive test ${JSON.stringify(test)} at index ${index}`)
                        })
                    }

                    if (negative) {
                        const { scan } = check

                        negative.forEach((test, index) => {
                            const result = first(scan(test))

                            assert.ok(!result, `${JSON.stringify(title)} validates against negative test ${JSON.stringify(test)} at index ${index}`)
                        })
                    }

                    if (safe) {
                        if (regex) {
                            assert.ok(safeRegex(regex), `${JSON.stringify(title)} validates safe regex test ${regex.toString()}`)
                        }

                        if (filterRegex) {
                            assert.ok(safeRegex(filterRegex), `${JSON.stringify(title)} validates safe filter regex test ${regex.toString()}`)
                        }
                    }
                }
            })
        })
    })
})
