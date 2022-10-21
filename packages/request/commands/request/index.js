exports.yargs = {
  command: 'request [url]',
  describe: 'Send requests',

  builder: {
    ...require('./options/url'),
    ...require('./options/proxy'),
    ...require('./options/output'),
    ...require('./options/request'),
    ...require('./options/scheduler'),

    'task-concurrency': {
      alias: ['C'],
      type: 'number',
      describe: 'The number of request tasks to run at the same time',
      default: Infinity,
    },
  },

  handler: async (argv) => {
    const { taskConcurrency, url } = argv

    const { Scheduler } = require('../../lib/scheduler')

    const scheduler = new Scheduler()

    require('./options/url/handler').init(argv, scheduler)
    require('./options/proxy/handler').init(argv, scheduler)
    require('./options/output/handler').init(argv, scheduler)
    require('./options/request/handler').init(argv, scheduler)
    require('./options/scheduler/handler').init(argv, scheduler)

    const { makeLineIterator } = require('@pown/cli/lib/line')
    const { eachOfLimit } = require('@pown/async/lib/eachOfLimit')

    const it = makeLineIterator(url)

    await eachOfLimit(it(), taskConcurrency, async (uri) => {
      if (!uri) {
        return
      }

      uri = uri.trim()

      if (!uri) {
        return
      }

      try {
        await scheduler.request({ uri })
      } catch (e) {
        console.error(e)
      }
    })
  },
}
