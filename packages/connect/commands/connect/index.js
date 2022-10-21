exports.yargs = {
  command: 'connect [address]',
  describe: 'Connect to addreess',

  builder: {
    ...require('./options/output'),
    ...require('./options/connect'),
    ...require('./options/scheduler'),

    'task-concurrency': {
      alias: ['C'],
      type: 'number',
      describe: 'The number of connect tasks to run at the same time',
      default: Infinity,
    },

    data: {
      alias: ['d'],
      type: 'string',
      describe: 'Data to send',
    },

    'json-data': {
      alias: ['D'],
      type: 'string',
      describe: 'Data to send (json encoded string)',
    },
  },

  handler: async (argv) => {
    const { taskConcurrency, data, jsonData, address } = argv

    const { Scheduler } = require('../../lib/scheduler')

    const scheduler = new Scheduler()

    require('./options/output/handler').init(argv, scheduler)
    require('./options/connect/handler').init(argv, scheduler)
    require('./options/scheduler/handler').init(argv, scheduler)

    const dataToSend = data ? data : jsonData ? JSON.parse(`"${jsonData}"`) : ''

    const { makeLineIterator } = require('@pown/cli/lib/line')
    const { eachOfLimit } = require('@pown/async/lib/eachOfLimit')

    const it = makeLineIterator(address)

    await eachOfLimit(it(), taskConcurrency, async (address) => {
      if (!address) {
        return
      }

      address = address.trim()

      if (!address) {
        return
      }

      const pair = address.split(':')

      const host = (pair[0] || '').trim()
      const port = (pair[1] || '').trim()

      try {
        await scheduler.connect({
          host,
          port: parseInt(port),
          data: dataToSend,
        })
      } catch (e) {
        console.error(e)
      }
    })
  },
}
