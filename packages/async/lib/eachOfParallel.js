const { eachOfLimit } = require('./eachOfLimit')

const eachOfParallel = async (iterable, handler) => {
  return eachOfLimit(iterable, handler, Infinity)
}

module.exports = { eachOfParallel }
