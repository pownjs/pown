exports.yargs = {
    command: 'install <modules...>',
    describe: 'Install modules',
    aliases: ['i'],

    builder: (yargs) => {
        yargs.option('development', {
            type: 'boolean',
            describe: 'Install development.',
            alias: ['o'],
            default: false
        })
    },

    handler: async(yargs) => {
        const { modules = [], development } = yargs

        const util = require('util')
        const { writeFile } = require('fs')
        const { spawn } = require('child_process')
        const { ensurePreferencesFilename, getPreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

        const spawnAsync = util.promisify(spawn)
        const writeFileAsync = util.promisify(writeFile)

        await ensurePreferencesFilename('modules', 'package.json')

        await writeFileAsync(getPreferencesFilename('modules', '.npmrc'), 'package-lock=false\n')

        const dirname = getPreferencesDirectory('modules')

        await spawnAsync('npm', ['install', ...modules, ...(development ? [] : ['--production'])], { stdio: 'inherit', cwd: dirname })
    }
}
