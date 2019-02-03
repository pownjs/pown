exports.yargs = {
    command: 'update [options]',
    describe: 'Update global installation of pown',
    aliases: ['upgrade', 'up'],

    handler: async(argv) => {
        const util = require('util')
        const { spawn } = require('child_process')

        const spawnAsync = util.promisify(spawn)

        await spawnAsync('npm', ['install', '-g', 'pown@latest'], { stdio: 'inherit' })
    }
}
