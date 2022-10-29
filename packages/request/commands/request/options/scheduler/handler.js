const init = (options, scheduler) => {
  const { requestConcurrency } = options

  if (requestConcurrency) {
    scheduler.reset({ maxConcurrent: requestConcurrency })
  }
}

module.exports = { init }
