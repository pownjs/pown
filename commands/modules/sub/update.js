exports.yargs = {
    command: 'update [modules...]',
    describe: 'Update modules',
    aliases: ['upgrade', 'up', 'u'],

    handler: async(yargs) => {
        const { modules = [] } = yargs

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['update', ...modules], { stdio: 'inherit', cwd: dirname })
    }
}
