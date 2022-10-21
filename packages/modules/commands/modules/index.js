exports.yargs = {
  command: 'modules <command>',
  describe: 'Module manager',
  aliases: ['module', 'mo', 'm'],

  builder: (yargs) => {
    yargs.command(require('./sub/install').yargs)
    yargs.command(require('./sub/uninstall').yargs)
    yargs.command(require('./sub/update').yargs)
    yargs.command(require('./sub/list').yargs)
    yargs.command(require('./sub/search').yargs)
  },
}
