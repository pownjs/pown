const { buildTool } = require('../lib/tool')

exports.yargs = buildTool('alienvault', () => {
  const { listAlienVaultURIs } = require('../../../lib/modules/alienvault')

  return listAlienVaultURIs
})
