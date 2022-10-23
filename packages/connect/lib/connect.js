const net = require('net')
const tls = require('tls')
const performanceNow = require('performance-now')

const EMPTY_BUFFER = Buffer.alloc(0)

const closeSocketAndCleanup = async (socket) => {
  try {
    // NOTE: force socket closure just in case

    socket.destroy()
  } catch (e) {
    // pass
  }
}

const connectInternal = (connect, resolve) => {
  const {
    type = 'base',
    host,
    port,
    data,
    info,
    timeout = 30000,
    connectTimeout = timeout,
    dataTimeout = timeout,
    download = true,
    downloadLimit = Infinity,
    certificate = false,
    ssl: _ssl = false,
    tls: _tls = _ssl,
    client = _tls ? tls : net,
    ...options
  } = connect

  const now = performanceNow()

  const transaction = {
    type,

    host,
    port,

    data,

    responseData: EMPTY_BUFFER,

    info: {
      ...info,

      open: false,

      startTime: now,
      stopTime: now,
    },
  }

  const responseDataChunks = []

  const socket = client.connect({ ...options, port, host }) // NOTE: some servers (like cloudflare) will not respond without providing servername via the options

  let connectTimeoutHandler

  if (connectTimeout) {
    socket.setTimeout(connectTimeout)

    connectTimeoutHandler = setTimeout(() => {
      socket.emit('timeout')
    }, connectTimeout)
  }

  socket.on('connect', () => {
    clearTimeout(connectTimeoutHandler)

    transaction.info.open = true

    if (!_tls) {
      if (data) {
        socket.write(data)
      }
    }
  })

  socket.on('secureConnect', () => {
    clearTimeout(connectTimeoutHandler)

    transaction.info.open = true

    if (_tls) {
      if (data) {
        socket.write(data)
      }
    }

    if (certificate && _tls) {
      try {
        transaction.info.certificate = socket.getPeerCertificate()
      } catch (e) {}
    }
  })

  let dataTimeoutHandler

  if (download) {
    let downloadSize = 0

    if (dataTimeout) {
      dataTimeoutHandler = setTimeout(() => {
        socket.emit('timeout')
      }, dataTimeout)
    }

    socket.on('data', async (data) => {
      clearTimeout(dataTimeoutHandler)

      responseDataChunks.push(data)

      downloadSize += data.length

      if (downloadSize <= downloadLimit) {
        if (dataTimeout) {
          dataTimeoutHandler = setTimeout(() => {
            socket.emit('timeout')
          }, dataTimeout)
        }
      } else {
        await closeSocketAndCleanup(socket)
      }
    })
  }

  const createErrorHandler = (errorType) => {
    return async (error) => {
      clearTimeout(connectTimeoutHandler)
      clearTimeout(dataTimeoutHandler)

      error = error || new Error(errorType)

      await closeSocketAndCleanup(socket)

      transaction.info.error = error
      transaction.info.stopTime = performanceNow()
      transaction.responseData = Buffer.concat(responseDataChunks)

      resolve(transaction)
    }
  }

  socket.on('timeout', createErrorHandler('Timeout'))

  socket.on('error', createErrorHandler('Error'))

  socket.on('close', async () => {
    clearTimeout(connectTimeoutHandler)
    clearTimeout(dataTimeoutHandler)

    await closeSocketAndCleanup(socket)

    transaction.info.stopTime = performanceNow()
    transaction.responseData = Buffer.concat(responseDataChunks)

    resolve(transaction)
  })
}

const connect = (connect) =>
  new Promise((resolve, reject) => {
    try {
      // all paths are happy paths

      connectInternal(connect, resolve)
    } catch (e) {
      reject(e)
    }
  })

module.exports = { connect }
