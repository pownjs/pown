exports.yargs = {
  command: 'lau <command>',
  describe: 'List all URLs',

  builder: (yargs) => {
    yargs.command(require('./sub/lau').yargs)
    yargs.command(require('./sub/alienvault').yargs)
    yargs.command(require('./sub/webarchive').yargs)
    yargs.command(require('./sub/commoncrawl').yargs)
  },
}
