exports.yargs = {
  command: 'preferences <command>',
  describe: 'Preferences',
  aliases: ['prefs'],

  builder: (yargs) => {
    yargs.command(require('./sub/get').yargs)
    yargs.command(require('./sub/set').yargs)
  },
}
