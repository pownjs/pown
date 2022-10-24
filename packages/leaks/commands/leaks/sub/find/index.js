exports.yargs = {
  command: '* [location]',
  describe: 'Find leaks',
  aliases: [],

  builder: {
    ...require('@pown/request/commands/request/options/scheduler'),
    ...require('@pown/request/commands/request/options/request'),
    ...require('@pown/request/commands/request/options/output'),
    ...require('@pown/request/commands/request/options/proxy'),

    'task-concurrency': {
      alias: ['C'],
      type: 'number',
      default: Infinity,
    },

    silent: {
      alias: ['s'],
      type: 'boolean',
      default: false,
    },

    json: {
      alias: ['j'],
      type: 'boolean',
      default: false,
    },

    unique: {
      alias: ['u'],
      type: 'boolean',
      default: false,
    },

    embed: {
      alias: ['e'],
      type: 'boolean',
      default: false,
    },

    write: {
      alias: ['w'],
      type: 'string',
      default: '',
    },

    tokenizer: {
      alias: ['z'],
      type: 'string',
      choices: ['none', 'code-line'],
      default: 'code-line',
    },

    'filter-title': {
      alias: ['title', 'filter-name', 'name'],
      type: 'string',
      default: '',
    },

    'filter-severity': {
      alias: ['severity', 'filter-level', 'level'],
      type: 'number',
      default: 0,
    },
  },

  handler: async (argv) => {
    const {
      taskConcurrency,
      silent,
      json,
      unique,
      embed,
      write,
      tokenizer,
      filterTitle,
      filterSeverity,
      location,
    } = argv

    const { Scheduler } = require('@pown/request/lib/scheduler')

    const scheduler = new Scheduler()

    require('@pown/request/commands/request/options/scheduler/handler').init(
      argv,
      scheduler
    )
    require('@pown/request/commands/request/options/request/handler').init(
      argv,
      scheduler
    )
    require('@pown/request/commands/request/options/output/handler').init(
      argv,
      scheduler
    )
    require('@pown/request/commands/request/options/proxy/handler').init(
      argv,
      scheduler
    )

    const fs = require('fs')
    const path = require('path')
    const { promisify } = require('util')
    const { makeLineIterator } = require('@pown/cli/lib/line')

    const statAsync = promisify(fs.stat)
    const readdirAsync = promisify(fs.readdir)
    const readFileAsync = promisify(fs.readFile)

    const fetchRequest = async (location) => {
      const { responseBody } = await scheduler.request({ uri: location })

      return responseBody
    }

    const fetchFile = async (location) => {
      const data = await readFileAsync(location)

      return data
    }

    const it = async function* () {
      const lit = makeLineIterator(location)

      for await (let loc of lit()) {
        if (/^https?:\/\//i.test(loc)) {
          yield { type: 'request', location: loc }
        } else {
          let stat

          try {
            stat = await statAsync(loc)
          } catch (e) {}

          if (!stat) {
            continue
          }

          async function* recurseDirectory(directory) {
            for (let entry of await readdirAsync(directory, {
              withFileTypes: true,
            })) {
              const pathname = path.resolve(path.join(directory, entry.name))

              if (entry.isDirectory()) {
                yield* recurseDirectory(pathname)
              } else {
                yield { type: 'file', location: pathname }
              }
            }
          }

          if (stat.isDirectory()) {
            yield* recurseDirectory(loc)
          } else {
            yield { type: 'file', location: path.resolve(loc) }
          }
        }
      }
    }

    let print = (location, result, text) => {
      const { check, index, exact, find, entropy } = result
      const { severity, title, regex } = check

      if (json) {
        const object = {
          location,
          severity,
          title,
          index,
          exact,
          find,
          regex: regex.toString(),
        }

        if (embed) {
          object['contents'] = text
        }

        console.log(JSON.stringify(object))
      } else {
        if (!silent) {
          console.warn(
            `title: ${title}, severity: ${severity}, index: ${index}, entropy: ${entropy}, location: ${location}`
          )
        }

        console.log(find)
      }
    }

    if (write) {
      print = ((print) => {
        const { createWriteStream } = require('fs')

        const ws = createWriteStream(write)

        return (location, result, text) => {
          const { check, index, exact, find, entropy } = result
          const { severity, title, regex } = check

          const object = {
            location,
            severity,
            title,
            index,
            exact,
            find,
            entropy,
            regex: regex.toString(),
          }

          if (embed) {
            object['contents'] = text
          }

          ws.write(JSON.stringify(object))
          ws.write('\n')

          print(location, result, text)
        }
      })(print)
    }

    if (unique) {
      print = ((print) => {
        const hash = {}

        return (location, result, text) => {
          if (hash[result.find]) {
            return
          }

          hash[result.find] = true

          print(location, result, text)
        }
      })(print)
    }

    const { Pilot } = require('../../../../lib/pilot')
    const { compileDatabase } = require('../../../../lib/compile')

    const lp = new Pilot({
      database: {
        ...compileDatabase(require('../../../../lib/database')),
        ...require('../../../../lib/scanners'),
      },
      title: filterTitle,
      severity: filterSeverity,
    })

    let iterator

    if (tokenizer === 'none') {
      iterator = (...args) => {
        return lp.iterateOverSearch(...args)
      }
    } else if (tokenizer === 'code-line') {
      iterator = (...args) => {
        return lp.iterateOverSearchPerCodeLine(...args)
      }
    } else {
      throw new Error(`Unrecognized tokenizer`)
    }

    const { eachOfLimit } = require('@pown/async/lib/eachOfLimit')

    await eachOfLimit(it(), taskConcurrency, async ({ type, location }) => {
      let fetch

      if (type === 'request') {
        fetch = fetchRequest
      } else if (type === 'file') {
        fetch = fetchFile
      } else {
        throw new Error(`Unknown type ${type}`)
      }

      try {
        const data = await fetch(location)
        const text = data.toString()

        for await (let result of iterator(text, { location })) {
          print(location, result, text)
        }
      } catch (e) {
        console.error(e)
      }
    })
  },
}
