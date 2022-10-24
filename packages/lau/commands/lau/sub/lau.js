const { buildTool } = require('../lib/tool')

exports.yargs = buildTool('*', () => {
    const { listURIs } = require('../../../lib/modules')

    return listURIs
})
