const { EventEmitter } = require('events')
const { eachOfLimit } = require('./eachOfLimit')
const { iterateOverEmitter } = require('./iterateOverEmitter')

const iterateOfLimit = async function*(iterable, handler, limit = 1) {
    if (typeof(limit) === 'function') {
        [handler, limit] = [limit, handler]
    }

    const em = new EventEmitter()

    eachOfLimit(iterable, async(item) => {
        item = await handler(item)

        if (item != null) {
            em.emit('item', item) // NOTE: only emit if not null
        }
    }, limit).then(() => em.emit('end')).catch((error) => em.emit('error', error))

    yield* iterateOverEmitter(em, 'item')
}

module.exports = { iterateOfLimit }
