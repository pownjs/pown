#!/usr/bin/env node

const child_process = require('child_process')

const run = (command) => {
    console.log(`$ ${command}`)

    return child_process.execSync(command, { stdio: 'ignore' })
}

const main = () => {
    require('../lib/splash')

    const modules = [
        'modules',
        'preferences',
        'blessed',
        'recon'
    ]

    console.log('* installing default modules', modules.join(', '))

    modules.forEach(((module) => {
        run(`pown modules install @pown/${module}`)
    }))

    console.log('* updating all modules')

    run('pown modules update')

    console.log('')
    console.log('Additional modules available!')
    console.log('')
    console.log('Try `pown modules search @pown`.')
    console.log('\n')
}

main()
