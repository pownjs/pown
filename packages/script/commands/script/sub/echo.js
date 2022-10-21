exports.yargs = {
  command: 'echo [message...]',
  describe: 'Echos message',

  builder: {
    type: {
      describe: 'Message type',
      default: 'info',
      alias: ['t'],
      choices: ['info', 'warn', 'error'],
    },
  },

  handler: (argv) => {
    const { type, message } = argv

    if (message) {
      console[type](...message)
    }
  },
}
