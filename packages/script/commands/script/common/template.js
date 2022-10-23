const { execute } = require('@pown/cli')
const { extract } = require('@pown/modules')

const { sub } = require('../sub')

async function exec(line) {
  const { loadableModules, loadableCommands } = await extract() // NOTE: assume this is coming from the cache so it must be fast

  const executeOptions = {
    loadableModules: loadableModules,
    loadableCommands: loadableCommands,

    inlineCommands: sub,

    file: '', // TODO: set to the file who called the function

    env: process.env,
  }

  await execute(line, executeOptions)
}

async function sh(strings, ...args) {
  const result = []

  for (const [index, string] of strings.entries()) {
    result.push(string, index < args.length ? args[index] : '')
  }

  const cmd = result.join('')

  return await exec(cmd)
}

async function shq(strings, ...args) {
  const result = []

  for (const [index, string] of strings.entries()) {
    result.push(
      string,
      index < args.length
        ? `'${args[index].replace(/'/g, String.raw`\'`)}'`
        : ''
    )
  }

  const cmd = result.join('')

  return await exec(cmd)
}

module.exports = {
  sh,
  shq,
}
