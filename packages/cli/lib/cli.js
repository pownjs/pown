const yargs = require('yargs/yargs')
const { atain } = require('@pown/modules')

const BLANK = function () {}

const tokenizeArgString = (argString) => {
  // NOTE: copied from https://github.com/yargs/yargs-parser/blob/master/lib/tokenize-arg-string.ts

  if (Array.isArray(argString)) {
    return argString.map((e) => (typeof e !== 'string' ? e + '' : e))
  }

  argString = argString.trim()

  let i = 0

  let prevC = null

  let c = null

  let opening = null

  const args = []

  for (let ii = 0; ii < argString.length; ii++) {
    prevC = c

    c = argString.charAt(ii)

    // split on spaces unless we're in quotes.

    if (c === ' ' && !opening) {
      if (!(prevC === ' ')) {
        i++
      }

      continue
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.

    if (c === opening) {
      opening = null
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c
    }

    if (!args[i]) {
      args[i] = ''
    }

    args[i] += c
  }

  return args
}

const pass1 = (input, env) => {
  input = input.replace(/\$(?:[\w_]+|[@])/g, (i) => {
    return env[i.slice(1)] || ''
  })

  input = input.replace(/\$\{(?:[\w_]+|[@])\}/g, (i) => {
    return env[i.slice(2, -1)] || ''
  })

  return input
}

const pass2 = (input, env) => {
  input = input
    .split(/(\$(?:[\w_]+|[@])|\$\{(?:[\w_]+|[@])\})/g)
    .map((i) => pass1(i, env))

  input = input.join(' ')

  return tokenizeArgString(input)
}

const parse = (input, env = {}) => {
  const args = []

  tokenizeArgString(input).forEach((arg) => {
    if (arg.startsWith(`"`) && arg.endsWith(`"`)) {
      args.push(pass1(arg.slice(1, -1), env))
    } else if (arg.startsWith(`'`) && arg.endsWith(`'`)) {
      args.push(arg.slice(1, -1))
    } else {
      args.push(...pass2(arg, env))
    }
  })

  return args
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
    'populate--': true,
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
          promise = new Promise(function (resolve, reject) {
            let result

            try {
              result = handler(...args)
            } catch (e) {
              reject(e)

              return
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
  }, true)

  const commands = [].concat(
    await Promise.all(
      loadableCommands.map(async (command) => {
        try {
          return await atain(command)
        } catch (e) {
          if (process.env.POWN_DEBUG) {
            console.error(e)
          }
        }
      })
    ),
    inlineCommands
  )

  commands.forEach(({ yargs }) => {
    if (yargs) {
      y.command(yargs).fail(false) // NOTE: we don't want to prematurely exit
    }
  })

  y.help()

  y.demandCommand()

  try {
    await y.parseAsync()
  } catch (e) {
    await y.showHelp()

    throw e
  }

  if (!promise) {
    promise = Promise.resolve()
  }

  return await promise
}

module.exports = { execute, parse }
