const { buildTool } = require('../lib/tool')

exports.yargs = buildTool('commoncrawl', () => {
  const { listCommonCrawlURIs } = require('../../../lib/modules/commoncrawl')

  return listCommonCrawlURIs
})
