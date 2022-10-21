// TODO: these needs to be move into the async module for better reusability

/**
 * @typedef {(any: any) => boolean|Promise<boolean>} Handler
 */

/**
 * @param {Iterable<any>} it
 * @param {Handler} handler
 * @returns {Promise<boolean>}
 */
const asyncEvery = async (it, handler) => {
  for await (let e of it) {
    if (!(await handler(e))) {
      return false
    }
  }

  return true
}

/**
 * @param {Iterable<any>} it
 * @param {Handler} handler
 * @returns {Promise<boolean>}
 */
const asyncSome = async (it, handler) => {
  for await (let e of it) {
    if (await handler(e)) {
      return true
    }
  }

  return false
}

/**
 * @param {Iterable<any>} it
 * @param {Handler} handler
 * @returns {Promise<boolean>}
 */
const asyncNone = async (it, handler) => {
  for await (let e of it) {
    if (await handler(e)) {
      return false
    }
  }

  return true
}

module.exports = {
  asyncEvery,
  asyncSome,
  asyncNone,
}
