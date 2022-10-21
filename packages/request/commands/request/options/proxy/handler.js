const init = (options, scheduler) => {
    const { proxyUrl } = options

    if (proxyUrl || process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
        let ProxyAgent

        try {
            ProxyAgent = require('proxy-agent')

            scheduler.on('request-scheduled', (request) => {
                request.agent = new ProxyAgent(proxyUrl)
            })
        }
        catch (e) {
            console.error(`install proxy-agent for http/s proxy support`)
        }
    }
}

module.exports = { init }
