const EventEmitter = require('events')
const Bottleneck = require('bottleneck')

const { connect } = require('./connect')

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

  async connect(options) {
    this.emit('connect-scheduled', options)

    const result = await this.limiter.schedule(async (options) => {
      this.emit('connect-executed', options)

      const result = await connect(options)

      this.emit('connect-finished', options, result)

      return result
    }, options)

    this.emit('connect-completed', options, result)

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
