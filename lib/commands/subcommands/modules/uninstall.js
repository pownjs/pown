exports.yargs = {
    command: 'uninstall <modules...>',
    describe: 'Uninstall modules',

    handler: async(yargs) => {
        const { modules = [] } = yargs

        const util = require('util')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)

        await ensurePreferencesFilename('modules', 'package.json')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['uninstall', ...modules], { stdio: 'inherit', cwd: dirname })
    }
}
