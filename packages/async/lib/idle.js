const { setImmediate } = require('timers')

const idle = (value) => {
  return new Promise((resolve) => {
    setImmediate(() => {
      resolve(value)
    })
  })
}

module.exports = { idle }
