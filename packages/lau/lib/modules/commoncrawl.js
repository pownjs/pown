const querystring = require('querystring')

const { requestJSON } = require('../scheduler')

const listCommonCrawlURIs = async function*(domain, options) {
    const { logger, scheduler, wildcard = '*.', ...schedulerOptions } = options || {}

    logger.info(`commoncrawl: fetching latest index`)

    const data = await requestJSON(scheduler, { ...schedulerOptions, uri: 'http://index.commoncrawl.org/collinfo.json' })

    const { 'cdx-api': uri } = data[0] || {}

    const search = `url=${encodeURIComponent(`${wildcard}${domain}`)}`

    const preQuery = querystring.stringify({
        output: 'json'
    })

    const parser = (input) => {
        const items = []

        for (let line of input.toString().split('\n')) {
            line = line.trim()

            if (!line) {
                continue
            }

            try {
                items.push(JSON.parse(line))
            }
            catch (e) {}
        }

        return items
    }

    let page = 0

    while (true) {
        logger.info(`commoncrawl: fetching page ${page}`)

        const postQuery = querystring.stringify({
            page: page++
        })

        console.debug(`commoncrawl: ${search}&${preQuery}&${postQuery}`)

        const data = await requestJSON(scheduler, { ...schedulerOptions, uri: `${uri}?${search}&${preQuery}&${postQuery}` }, { parser })

        if (!data.length) {
            break
        }

        for (let entry of data) {
            let { url = '' } = entry

            url = url.trim()

            if (/^https?:\/\//i.test(url)) {
                yield url
            }
        }
    }
}

module.exports = { listCommonCrawlURIs }
