const EventEmitter = require('events')
const Bottleneck = require('bottleneck')

const { request } = require('./request')

const systemLimiter = new Bottleneck()

class SystemScheduler extends EventEmitter {
    constructor() {
        super()

        this.limiter = systemLimiter
    }

    update(options) {
        this.limiter.updateSettings(options)
    }

    stop() {
        this.limiter.stop()
    }

    pause() {
        this.update({ reservoir: 0 })
    }

    resume() {
        this.update({ reservoir: null })
    }

    async request(options) {
        this.emit('request-scheduled', options)

        const result = await this.limiter.schedule(async(options) => {
            this.emit('request-executed', options)

            const result = await request(options)

            this.emit('request-finished', options, result)

            return result
        }, options)

        this.emit('request-completed', options, result)

        return result
    }
}

class Scheduler extends SystemScheduler {
    constructor(options) {
        super()

        const limiter = new Bottleneck(options)

        limiter.chain(this.limiter)

        this.limiter = limiter
    }

    update(options) {
        this.limiter.updateSettings(options)
    }

    stop() {
        this.limiter.stop()
    }

    pause() {
        this.update({ reservoir: 0 })
    }

    resume() {
        this.update({ reservoir: null })
    }
}

module.exports = { Scheduler, SystemScheduler, systemLimiter }
