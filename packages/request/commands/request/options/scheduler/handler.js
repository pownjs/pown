const init = (options, scheduler) => {
    const { requestConcurrency } = options

    if (requestConcurrency) {
        scheduler.update({ maxConcurrent: requestConcurrency })
    }
}

module.exports = { init }
