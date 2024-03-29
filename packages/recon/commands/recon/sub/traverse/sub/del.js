exports.yargs = {
  command: 'del <name>',
  describe: 'Delete named traversal',

  builder: () => {},

  handler: async (argv) => {
    const { name } = argv

    const { recon } = require('../../../lib/globals/recon')

    recon.cy.delTraversalByName(name)
  },
}
