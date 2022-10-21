#!/usr/bin/env node

const process = require('process')
const { extract } = require('@pown/modules')

const { execute } = require('../lib/cli')
const { init: initConsole } = require('../lib/console')

const boot = async () => {
  const { loadableModules, loadableCommands } = await extract()

  initConsole()

  await execute(process.argv.slice(2), { loadableModules, loadableCommands })
}

boot()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)

    process.exit(error.code || 1)
  })
