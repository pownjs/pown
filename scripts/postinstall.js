#!/usr/bin/env node

const child_process = require('child_process')

const run = (command) => {
    console.log(`$ ${command}`)

    return child_process.execSync(command, { stdio: 'ignore' })
}

const main = () => {
    require('../lib/splash')

    const modules = []

    if (modules.length) {
        console.log('* installing default modules', modules.join(', '))

        modules.forEach(((module) => {
            run(`pown modules install @pown/${module}`)
        }))
    }

    console.log('')
    console.log('Additional modules available!')
    console.log('')
    console.log('Try `pown modules search @pown`.')
    console.log('\n')
}

main()
