const { PassThrough } = require('stream')

const iterateOverEmitter = async function* (
  emitter,
  yieldEvent,
  handler,
  options
) {
  if (typeof handler !== 'function') {
    options = handler
    handler = undefined
  }

  const { errorEvent = 'error', endEvent = 'end' } = options || {}

  if (!handler) {
    handler = (chunk) => chunk
  }

  const stream = new PassThrough({ objectMode: true })

  const yieldEventHandler = (i) => {
    stream.write(i)
  }

  const errorEventHandler = (e) => {
    stream.emit('error', e)
  }

  const endEventHandler = () => {
    stream.end()
  }

  emitter.on(yieldEvent, yieldEventHandler)
  emitter.on(errorEvent, errorEventHandler)
  emitter.on(endEvent, endEventHandler)

  try {
    for await (const chunk of stream) {
      yield await handler(chunk)
    }
  } finally {
    emitter.off(yieldEvent, yieldEventHandler)
    emitter.off(errorEvent, errorEventHandler)
    emitter.off(endEvent, endEventHandler)
  }
}

module.exports = { iterateOverEmitter }
