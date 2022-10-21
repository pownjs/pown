module.exports = {
  'request-concurrency': {
    alias: ['c'],
    type: 'number',
    describe: 'The number of requests to send at the same time',
    default: Infinity,
  },
}
