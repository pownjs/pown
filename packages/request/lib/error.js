const RETRY_ERROR_CODE = 'RETRY'

/**
 * This error is only raised when we maxed the number of retries.
 */
class RetryError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message)

    this.code = RETRY_ERROR_CODE
  }
}

const BARRED_ERROR_CODE = 'BARRED'

/**
 * This error is only raised when a specific origin is barred.
 */
class BarredError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message)

    this.code = BARRED_ERROR_CODE
  }
}

module.exports = {
  RETRY_ERROR_CODE,

  RetryError,

  BARRED_ERROR_CODE,

  BarredError,
}
