const Bottleneck = require('bottleneck')

/**
 * Setup for future extensions.
 */
class SystemLimiter extends Bottleneck {}

/**
 * The system limiter is a global throttle for all requests.
 */
const systemLimiter = new SystemLimiter()

/**
 * Setup for future extensions.
 */
class Limiter extends SystemLimiter {}

module.exports = {
  SystemLimiter,

  systemLimiter,

  Limiter,
}
