const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')

const databaseRoot = path.join(__dirname, '..', 'database')

const db = {}

for (let file of fs.readdirSync(databaseRoot)) {
    const { title, variables = {}, checks = [] } = jsYaml.load(fs.readFileSync(path.join(databaseRoot, file)).toString())

    for (let check of checks) {
        Object.entries(variables).forEach(([name, value]) => {
            if (check.regex) {
                check.regex = check.regex.split('${' + name + '}').join(value)
            }

            if (check.filterRegex) {
                check.filterRegex = check.filterRegex.split('${' + name + '}').join(value)
            }
        })

        delete check.tests
    }

    db[path.basename(file, '.yaml')] = { title, checks }
}

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'database.json'), JSON.stringify(db, '', '  '))
