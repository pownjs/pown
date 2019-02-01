exports.yargs = {
    command: 'update [options]',
    describe: 'Update global installation of pown',
    aliases: ['upgrade', 'up'],

    handler: async(argv) => {
        const { spawn } = require('child_process')

        spawn('npm', ['install', '-g', 'pown@latest'], { stdio: 'inherit' })
    }
}
