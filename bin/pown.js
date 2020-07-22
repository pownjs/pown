#!/usr/bin/env node


const boot = async() => {
    const path = require('path')
    const { ensurePreferencesFilename, getPreferencesDirectory } = require('@pown/preferences')

    // stage0: add the local node_modules to the module search path

    module.paths.push(path.join(__dirname, '..', 'node_modules'))

    // stage1: setup pown root

    if (!process.env.POWN_ROOT) {
        process.env.POWN_ROOT = path.join(__dirname, '..')
    }

    // stage2: add modules node_modules to the module search path

    await ensurePreferencesFilename('modules', 'package.json')

    const dirname = getPreferencesDirectory('modules')

    module.paths.push(dirname)

    // stage3: setup pown modules

    process.env.POWN_PATH = [...(process.env.POWN_PATH ? process.env.POWN_PATH : []), dirname].join(path.delimiter)

    // stage4: launch

    require('@pown/cli/bin/cli')
}

boot()
