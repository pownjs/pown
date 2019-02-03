exports.yargs = {
    command: 'modules <command>',
    describe: 'Module manager',
    aliases: ['module', 'm'],

    builder: (yargs) => {
        yargs.command(require('./subcommands/module/install').yargs)
        yargs.command(require('./subcommands/module/uninstall').yargs)
        yargs.command(require('./subcommands/module/update').yargs)
        yargs.command(require('./subcommands/module/list').yargs)
    }
}
