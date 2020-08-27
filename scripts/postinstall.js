#!/usr/bin/env node

const child_process = require('child_process')

const run = (command) => {
    console.log(`[$] ${command}`)

    child_process.execSync(command)
}

const main = () => {
    require('../lib/splash')

    console.log('[*] installing default modules')

    ; // WTF

    [
        '@pown/buster',
        '@pown/cdb',
        '@pown/dicts',
        '@pown/blessed',
        '@pown/duct',
        '@pown/encoder',
        '@pown/lau',
        '@pown/leaks',
        '@pown/preferences',
        '@pown/proxy',
        '@pown/whoarethey',
        '@pown/recon'
    ].forEach(((module) => {
        run(`pown modules install ${module}`)
    }))

    console.log('[*] updating all modules')

    run('pown modules update')
}

main()
