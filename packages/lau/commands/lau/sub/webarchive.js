const { buildTool } = require('../lib/tool')

exports.yargs = buildTool('webarchive', () => {
  const { listWebArchiveURIs } = require('../../../lib/modules/webarchive')

  return listWebArchiveURIs
})
