const init = (options, scheduler) => {
    const { method, header, connectTimeout, dataTimeout, acceptUnauthorized } = options

    if (method) {
        scheduler.on('request-scheduled', (request) => {
            request.method = method
        })
    }

    if (connectTimeout) {
        scheduler.on('request-scheduled', (request) => {
            request.connectTimeout = connectTimeout
        })
    }

    if (dataTimeout) {
        scheduler.on('request-scheduled', (request) => {
            request.dataTimeout = dataTimeout
        })
    }

    scheduler.on('request-scheduled', (request) => {
        request.rejectUnauthorized = !acceptUnauthorized
    })

    if (header) {
        const headers = {}

        for (let entry of Array.isArray(header) ? header : [header]) {
            let [name = '', value = ''] = entry.split(':', 1)

            name = name.trim() || entry
            value = value.trim() || ''

            if (headers[name]) {
                if (!Array.isArray(headers[name])) {
                    headers[name] = [headers[name]]
                }

                headers[name].push(value)
            }
            else {
                headers[name] = value
            }
        }

        scheduler.on('request-scheduled', (request) => {
            if (!request.headers) {
                request.headers = {}
            }

            request.headers = {
                ...request.headers,

                ...headers
            }
        })
    }
}

module.exports = { init }
