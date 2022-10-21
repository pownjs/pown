const { writeFile } = require('fs')
const { promisify } = require('util')

const writeFileAsync = promisify(writeFile)

const init = (options, scheduler) => {
  const { contentSniffSize, printResponseData, downloadResponseData } = options

  scheduler.on('connect-finished', (request, response) => {
    const { host, port, responseData, info } = response

    const responseDataSniff = responseData
      .slice(0, contentSniffSize)
      .toString('base64')

    console.info(
      `${host}:${port} -> ${info.open ? 'open' : 'closed'} ${
        responseData.length
      } ${responseDataSniff ? responseDataSniff : '-'}`
    )

    if (printResponseData) {
      console.log(responseData.toString())
    }

    if (downloadResponseData) {
      writeFileAsync(
        `${host}:${port}`
          .replace(/\W+/g, '_')
          .replace(/_+/, '_')
          .replace(/([a-zA-Z0-9]+)$/, '.$1'),
        responseData
      )
    }
  })
}

module.exports = { init }
