exports.yargs = {
  command: 'exec <file>',
  describe: 'Execute js file',
  aliases: ['c'],

  builder: (yargs) => {
    const {
      installReadOptions,
      installWriteOptions,
    } = require('../../lib/handlers/file')

    installReadOptions(yargs)
    installWriteOptions(yargs)

    const { installOutputOptions } = require('../../lib/handlers/output')

    installOutputOptions(yargs)
  },

  handler: async (argv) => {
    const { file } = argv

    const path = require('path')
    const process = require('process')
    const { atain } = require('@pown/modules')
    const { sh, shq } = require('@pown/script/commands/script/common/template')

    const { recon } = require('../../lib/globals/recon')

    const {
      handleReadOptions,
      handleWriteOptions,
    } = require('../../lib/handlers/file')

    await handleReadOptions(argv, recon)

    const context = {
      argv: argv['--'] || [],

      recon,

      sh,
      shq,
    }

    console.info(`executing script ${file}`)

    const module = await atain(path.join(process.cwd(), file)) // TODO: we should not be doing our own path resolve

    if (typeof module === 'function') {
      await module(context)
    } else if (typeof module.default === 'function') {
      await module.default(context)
    }

    console.debug(`script execution completed`)

    const resultNodes = recon.selection.map((node) => node.data())

    await handleWriteOptions(argv, recon)

    const { handleOutputOptions } = require('../../lib/handlers/output')

    await handleOutputOptions(argv, resultNodes)
  },
}
