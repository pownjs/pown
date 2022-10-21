exports.yargs = {
    command: 'shell [options]',
    describe: 'Simple shell for executing pown commands',

    handler: async(argv) => {
        const { execute } = require('@pown/cli')
        const { extract } = require('@pown/modules')

        const { loadableModules, loadableCommands } = await extract()

        const { subcommands } = require('@pown/script/commands/script/subcommands')

        const executeOptions = {
            loadableModules: loadableModules,
            loadableCommands: loadableCommands,

            inlineCommands: subcommands
        }

        const readline = require('readline')

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'pown> ',
            terminal: true,
            completer: () => []
        })

        rl.write(`
88888b.   .d88b.  888  888  888 88888b.
888 "88b d88""88b 888  888  888 888 "88b
888  888 888  888 888  888  888 888  888
888 d88P Y88..88P Y88b 888 d88P 888  888
88888P"   "Y88P"   "Y8888888P"  888  888
888
888        JS
888
`)

        const originalExit = process.exit

        process.exit = function(...args) {}

        const processExit = (code) => {
            process.exit = originalExit

            process.exit(code)
        }

        rl.prompt()

        for await (let line of rl) {
            line = line.trim()

            if (!line || line.startsWith('#')) {
                rl.prompt()

                continue
            }

            try {
                await execute(line, executeOptions)
            }
            catch (e) {
                if (e.exitCode) {
                    console.warn(e.message)

                    return processExit(e.exitCode)
                }
                else {
                    console.error(e)
                }
            }

            prompt: rl.prompt()
        }

        return processExit(0)
    }
}
