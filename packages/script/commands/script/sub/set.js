exports.yargs = {
  command: 'set [options]',
  describe: 'Set scripting options',

  builder: {
    exit: {
      describe: 'Exit immediately',
      type: 'boolean',
      alias: ['e'],
    },

    expand: {
      describe: 'Expand command',
      type: 'boolean',
      alias: ['x'],
    },
  },

  handler: (argv) => {
    const { exit, expand } = argv

    const { options } = require('../globals/options')

    if (exit !== undefined) {
      options.exit = exit
    }

    if (expand !== undefined) {
      options.expand = expand
    }
  },
}
