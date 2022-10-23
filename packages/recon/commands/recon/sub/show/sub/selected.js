exports.yargs = {
  command: 'selected',
  describe: 'Show what is selected',
  aliases: ['s'],

  builder: (yargs) => {
    const {
      installReadOptions,
      installWriteOptions,
    } = require('../../../lib/handlers/file')

    installReadOptions(yargs)
    installWriteOptions(yargs)

    const { installOutputOptions } = require('../../../lib/handlers/output')

    installOutputOptions(yargs)
  },

  handler: async (argv) => {
    const { recon } = require('../../../lib/globals/recon')

    const {
      handleReadOptions,
      handleWriteOptions,
    } = require('../../../lib/handlers/file')

    await handleReadOptions(argv, recon)

    const resultNodes = recon.selection.map((node) => node.data())

    await handleWriteOptions(argv, recon)

    const { handleOutputOptions } = require('../../../lib/handlers/output')

    await handleOutputOptions(argv, resultNodes)
  },
}
