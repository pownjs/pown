exports.yargs = {
  command: 'sh [cmd...]',
  describe: 'Run shell command',

  builder: {
    command: {
      describe: 'The shell command',
      type: 'string',
      alias: ['c'],
    },
  },

  handler: async (argv) => {
    const { command, cmd } = argv

    const { execSync } = require('child_process')

    if (command) {
      execSync(command, { stdio: 'inherit' })
    } else if (cmd) {
      execSync(cmd.join(' '), { stdio: 'inherit' })
    }
  },
}
