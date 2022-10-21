const process = require('process')
const readline = require('readline')

const makeLineIterator = (input) => {
  if ([true, false, '-'].includes(input) || !input) {
    const rl = readline.createInterface({
      input: process.stdin,
    })

    return async function* () {
      for await (let line of rl) {
        yield line
      }
    }
  } else {
    return function* () {
      if (Array.isArray(input)) {
        yield* input
      } else {
        yield input
      }
    }
  }
}

module.exports = { makeLineIterator }
