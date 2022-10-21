const init = (options, scheduler) => {
    const { urlSuffix, urlPrefix } = options

    scheduler.on('request-scheduled', (request) => {
        if (urlPrefix) {
            request.uri = urlPrefix + request.uri
        }

        if (urlSuffix) {
            request.uri = request.uri + urlSuffix
        }

        if (!/https?:\/\//i.test(request.uri)) {
            request.uri = 'https://' + request.uri
        }
    })
}

module.exports = { init }
