const { Semaphore } = require('./semaphore')

const eachOfLimit = async (iterable, handler, limit = 1) => {
  if (typeof limit === 'function') {
    ;[handler, limit] = [limit, handler]
  }

  const semaphore = new Semaphore(limit)

  const errors = []

  try {
    for await (const item of iterable) {
      const release = await semaphore.acquire()

      release(handler(item)).catch((e) => errors.push(e))

      if (errors.length) {
        break // NOTE: bailout as soon as we know there are errors
      }
    }
  } catch (e) {
    errors.push(e)
  }

  await semaphore.join()

  if (errors.length) {
    if (typeof AggregateError === 'function') {
      throw new AggregateError(errors) // eslint-disable-line
    } else {
      throw errors[0]
    }
  }
}

module.exports = { eachOfLimit }
