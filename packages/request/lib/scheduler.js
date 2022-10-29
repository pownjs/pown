const EventEmitter = require('events')

const { request } = require('./request')
const { BarredError } = require('./bar')
const { systemLimiter, Limiter } = require('./limiter')

/**
 * @typedef {{maxRetries?: number, retryBackoff?: number}} RetryOptions
 * @typedef {{maxFailuresToBar?: number, barredOrigins?: Record<string,number>}} BarOptions
 * @typedef {{maxConcurrent?: number, reservoir?: number}} LimiterOptions
 */

/**
 * The system scheduler is global for the entire running applications. This is
 * of course limited to the current running context and not threads, workers,
 * and other forms of paralism.
 */
class SystemScheduler extends EventEmitter {
  /**
   * @param {RetryOptions & BarOptions} [options]
   */
  constructor(options) {
    super()

    this.limiter = systemLimiter

    const {
      maxRetries = 5,
      retryBackoff = 1000,

      maxFailuresToBar = 10,
      barredOrigins = {},
    } = options || {}

    this.maxRetries = maxRetries
    this.retryBackoff = retryBackoff

    this.maxFailuresToBar = maxFailuresToBar

    this.barredOrigins = barredOrigins
  }

  /**
   * @param {RetryOptions & BarOptions & LimiterOptions} options
   */
  reset(options) {
    const {
      maxRetries,
      retryBackoff,

      maxFailuresToBar,

      barredOrigins,

      ...limiterOptions
    } = options

    if (Object.keys(limiterOptions).length) {
      this.limiter.updateSettings(limiterOptions)
    }

    this.maxRetries = maxRetries ?? this.maxRetries
    this.retryBackoff = retryBackoff ?? this.retryBackoff

    this.maxFailuresToBar = maxFailuresToBar ?? this.maxFailuresToBar

    this.barredOrigins = barredOrigins ?? this.barredOrigins
  }

  stop() {
    this.limiter.stop()
  }

  pause() {
    this.limiter.updateSettings({ reservoir: 0 })
  }

  resume() {
    this.limiter.updateSettings({ reservoir: null })
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

    return (
      this.barredOrigins[origin] &&
      this.barredOrigins[origin] >= this.maxFailuresToBar
    )
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
          } else {
            this.riseBar(options)

            // NOTE: This mechanism is suboptimal because the scheduler will
            // idle while the task is sleeping instead of doing some work with
            // other incoming requests.
            //
            // A better approach might be to simply push the task back
            // into the queue but with some backoff timeout but this could also
            // have some undesirable side-effects especially when other multi-
            // tasking capabilities are in place.

            await new Promise((resolve) => {
              setTimeout(resolve, this.retryBackoff * Math.pow(2, retries++))
            })
          }
        } else {
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
 * The system scheduler is a global scheduler for all requests
 */
const systemScheduler = new SystemScheduler()

/**
 * Requests can be further limited but a dedicated Scheduler instance. This
 * class takes into account the preferences of the system scheduler.
 */
class Scheduler extends SystemScheduler {
  /**
   * @param {RetryOptions & BarOptions & LimiterOptions} [options]
   */
  constructor(options) {
    const {
      maxRetries,
      retryBackoff,

      maxFailuresToBar,

      barredOrigins,

      ...limiterOptions
    } = options || {}

    super({
      maxRetries,
      retryBackoff,

      maxFailuresToBar,

      barredOrigins,
    })

    const limiter = new Limiter(limiterOptions)

    limiter.chain(this.limiter)

    this.limiter = limiter
  }
}

module.exports = {
  SystemScheduler,

  systemScheduler,

  Scheduler,
}
