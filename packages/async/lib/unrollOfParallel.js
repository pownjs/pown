const { EventEmitter } = require('events')

const { isIterable, isString } = require('./utils')
const { eachOfParallel } = require('./eachOfParallel')
const { iterateOverEmitter } = require('./iterateOverEmitter')

const unrollOfParallel = async function* (iterables) {
  const ee = new EventEmitter()

  eachOfParallel(iterables, async (item) => {
    if (isIterable(item) && !isString(item)) {
      for await (let subitem of unrollOfParallel(item)) {
        ee.emit('item', subitem)
      }
    } else {
      ee.emit('item', item)
    }
  })
    .then(() => ee.emit('end'))
    .catch((error) => ee.emit('error', error))

  yield* iterateOverEmitter(ee, 'item')
}

module.exports = { unrollOfParallel }
