exports.yargs = {
  command: 'set <name> <expression>',
  describe: 'Set named traversal',

  builder: () => {},

  handler: async (argv) => {
    const { name, expression } = argv

    const { recon } = require('../../../lib/globals/recon')

    recon.cy.setTraversalByName(name, expression)
  },
}
