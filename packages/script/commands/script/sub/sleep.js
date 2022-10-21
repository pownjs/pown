exports.yargs = {
    command: 'sleep [options] <seconds>',
    describe: 'Sleep seconds',

    builder: {},

    handler: (argv) => {
        const { seconds } = argv

        const { setTimeout } = require('timers')

        const milliseconds = parseInt(seconds) * 1000

        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds)
        })
    }
}
