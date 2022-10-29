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
  BARRED_ERROR_CODE,

  BarredError,
}
