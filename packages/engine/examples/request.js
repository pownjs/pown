const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')
const { request } = require('@pown/request')

const { Template } = require('../lib/template.js')
const { ConsoleTracer } = require('../lib/trace.js')

class RequestTemplate extends Template {
  async executeTask(taskName, task, input = {}) {
    if (taskName === 'request') {
      const { url, uri = url, ...req } = task

      return request({ ...req, uri: this.interpolate(uri, input) })
    }

    throw new Error(`Unrecognized task ${taskName}`)
  }
}

const main = async () => {
  const document = jsYaml.load(
    fs.readFileSync(path.join(__dirname, 'request.yaml')).toString()
  )
  const template = new RequestTemplate(document, {
    tracer: new ConsoleTracer(),
  })

  await template.run({ hostname: 'httpbin.org' })
}

main().catch(console.error)
