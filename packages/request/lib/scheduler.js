const EventEmitter = require('events')
const Bottleneck = require('bottleneck')

const { request } = require('./request')

const systemLimiter = new Bottleneck()

/**
 * The system scheduler is global for the entire running applications. This is
 * of course limited to the current running context and not threads, workers,
 * and other forms of paralism.
 */
class SystemScheduler extends EventEmitter {
  constructor(options) {
    super()

    this.limiter = systemLimiter

    const { maxRetries = 5, retryBackoff = 1000 } = options || {}

    this.maxRetries = maxRetries
    this.retryBackoff = retryBackoff
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

    const result = await this.limiter.schedule(async (options) => {
      this.emit('request-executed', options)

      let result

      let retries = 0

      for (;;) {
        result = await request(options)

        if (result.info?.error) {
          if (result.info.error.code === 'ENOTFOUND') {
            break
          }
          else {
            await new Promise((resolve) => {
              setTimeout(resolve, this.retryBackoff * Math.pow(2, retries++))
            })
          }
        }
        else {
          break
        }
      }

      this.emit('request-finished', options, result)

      return result
    }, options)

    this.emit('request-completed', options, result)

    return result
  }
}

/**
 * Requests can be further limited but a dedicated Scheduler instance. This
 * class takes into account the preferences of the system scheduler.
 */
class Scheduler extends SystemScheduler {
  constructor(options) {
    super(options)

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

module.exports = {
  systemLimiter,

  SystemScheduler,

  Scheduler
}
