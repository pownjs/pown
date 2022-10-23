exports.yargs = {
  command: 'show <command>',
  describe: 'Show recon state',
  aliases: ['view'],

  builder: (yargs) => {
    yargs.command(require('./sub/selected').yargs)
  },
}
