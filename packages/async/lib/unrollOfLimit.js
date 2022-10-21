const { EventEmitter } = require('events')

const { isIterable, isString } = require('./utils')
const { eachOfLimit } = require('./eachOfLimit')
const { iterateOverEmitter } = require('./iterateOverEmitter')

const unrollOfLimit = async function* (iterables, limit = 1) {
  const ee = new EventEmitter()

  eachOfLimit(
    iterables,
    async (item) => {
      if (isIterable(item) && !isString(item)) {
        for await (let subitem of unrollOfLimit(item)) {
          ee.emit('item', subitem)
        }
      } else {
        ee.emit('item', item)
      }
    },
    limit
  )
    .then(() => ee.emit('end'))
    .catch((error) => ee.emit('error'))

  yield* iterateOverEmitter(ee, 'item')
}

module.exports = { unrollOfLimit }
