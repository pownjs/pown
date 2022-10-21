exports.yargs = {
    command: 'list',
    describe: 'List install modules',
    aliases: ['ls', 'l'],

    builder: (yargs) => {
        yargs.option('depth', {
            type: 'number',
            describe: 'List depth.',
            alias: ['d'],
            default: 0
        })
    },

    handler: async(yargs) => {
        const { depth = 0 } = yargs

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['list', '--depth', depth], { shell: true, stdio: 'inherit', cwd: dirname })
    }
}
