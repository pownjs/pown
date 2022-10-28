const EventEmitter = require('events')
const Bottleneck = require('bottleneck')

const { request } = require('./request')

const BARRED_ERROR_CODE = 'BARRED'

class BarredError extends Error {
  constructor(message) {
    super(message)

    this.code = BARRED_ERROR_CODE
  }
}

/**
 * The system limiter is a global throttle for all requests.
 */
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

    const { maxRetries = 5, retryBackoff = 1000, maxFailuresToBar = 10 } = options || {}

    this.maxRetries = maxRetries
    this.retryBackoff = retryBackoff

    this.maxFailuresToBar = maxFailuresToBar

    this.barredOrigins = {}
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

  getBarOrigin = (request) => {
      return request.uri?.replace(/^(https?:\/\/[^/]+).*/i, '$1') || ''
  }

  reverseBar = (request) => {
      const origin = this.getBarOrigin(request)

      delete this.barredOrigins[origin]
  }

  riseBar = (request) => {
      const origin = this.getBarOrigin(request)

      this.barredOrigins[origin] = (this.barredOrigins[origin] || 0) + 1
  }

  permanentlyBar(request) {
      const origin = this.getBarOrigin(request)

      this.barredOrigins[origin] = this.maxFailuresToBar
  }

  isBarred = (request) => {
      const origin = this.getBarOrigin(request)

      return this.barredOrigins[origin] && this.barredOrigins[origin] >= this.maxFailuresToBar
  }

  async request(options) {
    this.emit('request-scheduled', options)

    const result = await this.limiter.schedule(async (options) => {
      this.emit('request-executed', options)

      let result

      let retries = 0

      for (;;) {
        if (this.isBarred(options)) {
          result = { ...options, info: { error: new BarredError('Barred') } }

          break
        }

        result = await request(options)

        if (result.info?.error) {
          if (result.info.error.code === 'ENOTFOUND') {
            this.permanentlyBar(options)

            break
          }
          else {
            this.riseBar(options)

            await new Promise((resolve) => {
              setTimeout(resolve, this.retryBackoff * Math.pow(2, retries++))
            })
          }
        }
        else {
          this.reverseBar(options)

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
  BARRED_ERROR_CODE,

  BarredError,

  systemLimiter,

  SystemScheduler,

  Scheduler
}
