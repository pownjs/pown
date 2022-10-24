const querystring = require('querystring')

const { requestJSON } = require('../scheduler')

const listAlienVaultURIs = async function* (domain, options) {
  const {
    logger,
    scheduler,
    pageSize = 50,
    ...schedulerOptions
  } = options || {}

  const search = `${encodeURIComponent(domain)}`

  const preQuery = querystring.stringify({
    limit: pageSize,
  })

  let page = 0

  for (;;) {
    logger.info(`alienvault: fetching page ${page}`)

    const postQuery = querystring.stringify({
      page: page,
    })

    console.debug(`alienvault: ${search}?${preQuery}&${postQuery}`)

    const data = await requestJSON(scheduler, {
      ...schedulerOptions,
      uri: `https://otx.alienvault.com/otxapi/indicator/hostname/url_list/${search}?${preQuery}&${postQuery}`,
    })

    const { has_next, url_list } = data

    for (let item of url_list) {
      let { url = '' } = item

      url = url.trim()

      if (/^https?:\/\//i.test(url)) {
        yield url
      }
    }

    if (has_next) {
      page += 1
    } else {
      break
    }
  }
}

module.exports = { listAlienVaultURIs }
