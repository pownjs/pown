const { setTimeout } = require('timers')

const sleep = (milliseconds, value) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value)
    }, milliseconds)
  })
}

module.exports = { sleep }
