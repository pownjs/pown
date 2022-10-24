const { Transform } = require('stream')
const { atain } = require('@pown/modules')
const { parentPort } = require('worker_threads')
const { iterateOverStream } = require('@pown/async/lib/iterateOverStream')

const { serialize } = require('./utils')
const { Scheduler } = require('../scheduler')

const getSafeError = (error) => {
  return {
    __isError: true,
    type: error.type,
    message: error.message,
    stack: error.stack,
  }
}

const getSafeArgs = (args) => {
  return args.map((arg) =>
    arg && arg instanceof Error ? getSafeError(arg) : arg
  )
}

console.info = (...args) => {
  parentPort.postMessage({ type: 'transform.info', args: getSafeArgs(args) })
}

console.warn = (...args) => {
  parentPort.postMessage({ type: 'transform.warn', args: getSafeArgs(args) })
}

console.error = (...args) => {
  parentPort.postMessage({ type: 'transform.error', args: getSafeArgs(args) })
}

console.debug = (...args) => {
  parentPort.postMessage({ type: 'transform.debug', args: getSafeArgs(args) })
}

const stream = new Transform({
  writablehighWaterMark: Infinity,
  readableHighWaterMark: Number.MAX_VALUE,

  objectMode: true,

  transform(chunk, encoding, callback) {
    callback(null, chunk)
  }
})

const transform = new (class {
  constructor() {
    this.running = false
  }

  info(...args) {
    parentPort.postMessage({ type: 'transform.info', args: getSafeArgs(args) })
  }

  warn(...args) {
    parentPort.postMessage({ type: 'transform.warn', args: getSafeArgs(args) })
  }

  error(...args) {
    parentPort.postMessage({ type: 'transform.error', args: getSafeArgs(args) })
  }

  debug(...args) {
    parentPort.postMessage({ type: 'transform.debug', args: getSafeArgs(args) })
  }

  progress(...args) {
    parentPort.postMessage({
      type: 'transform.progress',
      args: getSafeArgs(args),
    })
  }

  async run(options) {
    if (this.running) {
      throw new Error(`Transform already running`)
    } else {
      this.running = true
    }

    const {
      transformModule,
      transformName,
      transformOptions,
      transformConcurrency,
    } = options

    const module = await atain(transformModule)

    const Transform = transformName ? module[transformName] : typeof module === 'function' ? module : module.default

    if (typeof Transform !== 'function') {
      throw new Error(`Transform ${transformName} not found`)
    }

    const transform = new Transform({ scheduler: new Scheduler() })

    transform.on('info', this.info)
    transform.on('warn', this.warn)
    transform.on('error', this.error)
    transform.on('debug', this.debug)
    transform.on('progress', this.progress)

    for await (let result of transform.itr(iterateOverStream(stream, ({ node }) => node), transformOptions, transformConcurrency)) {
      parentPort.postMessage({ type: 'yield', result: serialize(result) })
    }

    parentPort.postMessage({ type: 'end' })
  }
})()

const onMessage = async ({ type, ...options }) => {
  switch (type) {
    case 'stream.put':
      await stream.push(options)

      break

    case 'stream.end':
      await stream.end()

      break

    case 'run':
      await transform.run(options)

      break

    default:
      throw new Error(`Unrecognized message type ${type}`)
  }
}

parentPort.on('message', (message) => {
  onMessage(message).catch((error) =>
    parentPort.postMessage({ type: 'error', error: getSafeError(error) })
  )
})
