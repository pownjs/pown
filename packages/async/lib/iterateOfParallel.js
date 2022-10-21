const { EventEmitter } = require('events')
const { eachOfParallel } = require('./eachOfParallel')
const { iterateOverEmitter } = require('./iterateOverEmitter')

const iterateOfParallel = async function*(iterable, handler) {
    const em = new EventEmitter()

    eachOfParallel(iterable, async(item) => em.emit('item', await handler(item))).then(() => em.emit('end')).catch((error) => em.emit('error', error))

    yield* iterateOverEmitter(em, 'item')
}

module.exports = { iterateOfParallel }
