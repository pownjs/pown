exports.yargs = {
    command: 'modules <command>',
    describe: 'Module manager',
    aliases: ['module', 'm'],

    builder: (yargs) => {
        yargs.command(require('./subcommands/modules/install').yargs)
        yargs.command(require('./subcommands/modules/uninstall').yargs)
        yargs.command(require('./subcommands/modules/update').yargs)
        yargs.command(require('./subcommands/modules/list').yargs)
    }
}
