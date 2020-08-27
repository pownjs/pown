exports.yargs = {
    command: 'search <terms...>',
    describe: 'Search modules',
    aliases: ['s'],

    handler: async(yargs) => {
        const { terms = [] } = yargs

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['search', ...terms], { stdio: 'inherit', cwd: dirname })
    }
}
