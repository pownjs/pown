exports.yargs = {
  command: 'exit <code>',
  describe: 'Exit',

  builder: {},

  handler: (argv) => {
    const { code } = argv

    const error = new Error('Forced exit')

    error.exitCode = parseInt(code)

    throw error
  },
}
