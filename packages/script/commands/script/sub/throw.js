exports.yargs = {
    command: 'throw [message...]',
    describe: 'Throw message',

    handler: (argv) => {
        const { message } = argv

        throw new Error(message.join(' '))
    }
}
