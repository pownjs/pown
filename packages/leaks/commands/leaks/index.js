exports.yargs = {
    command: 'leaks <command>',
    describe: 'Leaks / secrets detection tool',
    aliases: ['leak'],

    builder: (yargs) => {
        yargs.command(require('./sub/find').yargs)
        yargs.command(require('./sub/export').yargs)
    }
}
