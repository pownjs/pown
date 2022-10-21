const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')

const { Template } = require('../lib/template.js')
const { ConsoleTracer } = require('../lib/trace.js')

const main = async () => {
  const document = jsYaml.load(
    fs.readFileSync(path.join(__dirname, 'analyzer.yaml')).toString()
  )
  const template = new Template(document, { tracer: new ConsoleTracer() })

  await template.run({})
  console.log('---')
  await template.run({
    responseHeaders: {
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true',
    },
  })
}

main().catch(console.error)
