const init = (options, scheduler) => {
  const { connectConcurrency } = options

  if (connectConcurrency) {
    scheduler.update({ maxConcurrent: connectConcurrency })
  }
}

module.exports = { init }
