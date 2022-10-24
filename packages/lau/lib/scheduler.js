const requestJSON = async (scheduler, request, options) => {
  const { retry = 5 } = request
  const { parser: parse = JSON.parse } = options || {}

  const times = Math.max(0, retry) + 1

  for (let i = 0; i < times; i++) {
    if (i > 0) {
      console.info(`retrying ${i}/${retry}`)
    }

    const { responseBody } = await scheduler.request(request)

    try {
      return parse(responseBody)
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(new Error(`Parsing JSON data from ${request.uri} failed`))
        console.error(e)
      }
    }
  }

  throw new Error(`Unable to parse JSON data`)
}

module.exports = { requestJSON }
