exports.yargs = {
    command: 'list',
    describe: 'list install modules',

    handler: async(yargs) => {
        const { depth = 0 } = yargs

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['list', '--depth', depth], { stdio: 'inherit', cwd: dirname })
    }
}
