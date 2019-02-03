exports.yargs = {
    command: 'install <modules...>',
    describe: 'Install modules',

    handler: async(yargs) => {
        const { modules = [] } = yargs

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['install', ...modules], { stdio: 'inherit', cwd: dirname })
    }
}
