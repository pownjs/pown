const yargs = require('yargs/yargs')
const shellQuote = require('shell-quote')

const BLANK = function () {}

const parse = (input, env = {}) => {
  return shellQuote.parse(input, env)
}

const execute = async (args, options = {}) => {
  const {
    command,
    loadableModules = {},
    inlineModules = {},
    loadableCommands = [],
    inlineCommands = [],
    file = '',
    env = {},
  } = options

  if (!Array.isArray(args)) {
    args = parse(args, env)
  }

  const y = yargs(args)

  y.parserConfiguration({
    'populate--': true
  })

  y.env('POWN')

  y.config()

  if (command) {
    y.$0 = command
  }

  let promise

  y.command = (function (command) {
    return function (options) {
      let { handler = BLANK } = options

      handler = handler.bind(yargs)

      return command.call(this, {
        ...options,

        handler: function (...args) {
          promise = new Promise(async function (resolve, reject) {
            let result

            try {
              result = await handler(...args)
            } catch (e) {
              reject(e)
            }

            resolve(result)
          })
        },
      })
    }
  })(y.command)

  y.usage(`$0 [options] <command> [command options]`)

  y.context = {
    yargs: y,
    loadableModules: loadableModules,
    inlineModules: inlineModules,
    loadableCommands: loadableCommands,
    inlineCommands: inlineCommands,
    file: file,
  }

  y.wrap(null)

  y.middleware((argv) => {
    argv.context = {
      yargs: y,
      loadableModules: loadableModules,
      inlineModules: inlineModules,
      loadableCommands: loadableCommands,
      inlineCommands: inlineCommands,
      file: file,
    }
  })

  const commands = [].concat(
    await Promise.all(
      loadableCommands.map(async (command) => {
        try {
          return require(command)
        } catch (e) {
          if (
            e.code === 'ERR_REQUIRE_ESM' ||
            e.message === 'Cannot use import statement outside a module'
          ) {
            return await import(command)
          }

          throw e
        }
      })
    ),
    inlineCommands
  )

  commands.forEach(({ yargs }) => {
    if (yargs) {
      y.command(yargs)
    }
  })

  y.help()

  y.demandCommand(1, 'You need to specify a command')

  await y.parse()

  if (!promise) {
    promise = Promise.resolve()
  }

  return promise
}

module.exports = { execute, parse }
