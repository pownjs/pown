const init = (options, scheduler) => {
    const { connectTimeout, dataTimeout, acceptUnauthorized, tls } = options

    if (connectTimeout) {
        scheduler.on('connect-scheduled', (connect) => {
            connect.connectTimeout = connectTimeout
        })
    }

    if (dataTimeout) {
        scheduler.on('connect-scheduled', (connect) => {
            connect.dataTimeout = dataTimeout
        })
    }

    scheduler.on('connect-scheduled', (connect) => {
        connect.rejectUnauthorized = !acceptUnauthorized
        connect.tls = tls
    })
}

module.exports = { init }
