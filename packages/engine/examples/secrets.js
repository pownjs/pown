const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')

const { Template } = require('../lib/template.js')
const { ConsoleTracer } = require('../lib/trace.js')

const main = async() => {
    const document = jsYaml.load(fs.readFileSync(path.join(__dirname, 'secrets.yaml')).toString())
    const template = new Template(document, { tracer: new ConsoleTracer() })

    await template.run({data: ''})
    console.log('---')
    await template.run({data: 'AKIAJE56YT5SVRUGH5OA'})
}

main().catch(console.error)
