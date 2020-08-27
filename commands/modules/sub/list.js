exports.yargs = {
    command: 'list',
    describe: 'List install modules',
    aliases: ['ls', 'l'],

    builder: (yargs) => {
        yargs.option('optional', {
            type: 'boolean',
            describe: 'List optional packages.',
            alias: ['o'],
            default: false
        })

        yargs.option('depth', {
            type: 'number',
            describe: 'List depth.',
            alias: ['d'],
            default: 0
        })
    },

    handler: async(yargs) => {
        const { optional = false, depth = 0 } = yargs

        if (optional) {
            const dist = require('@pown/dist/lib/modules/official.json')

            Object.entries(dist).forEach(([name, { description = '' }]) => {
                console.log(`${name} - ${description}`)
            })

            return
        }

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['list', '--depth', depth], { stdio: 'inherit', cwd: dirname })
    }
}
