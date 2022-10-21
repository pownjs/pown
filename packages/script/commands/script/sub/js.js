exports.yargs = {
    command: 'js [script]',
    describe: 'Run js expression',

    builder: {
        expression: {
            describe: 'JavaScript expression',
            type: 'string',
            alias: ['e']
        }
    },

    handler: async(argv) => {
        const { expression, script } = argv

        const main = async() => {
            if (expression) {
                await eval(expression)
            }
            else
            if (script) {
                const path = require('path')
                const { readFile } = require('fs')
                const { promisify } = require('util')

                const readFileAsync = promisify(readFile)

                const data = await readFileAsync(path.resolve(path.dirname(argv.context.file), script))

                await eval(data.toString())
            }
        }

        await main()
    }
}
