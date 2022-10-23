exports.yargs = {
  command: 'clear [options]',
  describe: 'Clear cache configuration',
  aliases: ['c'],

  builder: () => {},

  handler: () => {
    const { clearCache } = require('../../../lib/globals/cache')

    clearCache()
  },
}
