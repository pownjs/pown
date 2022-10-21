const url = require('url')
const util = require('util')
const http = require('http')
const zlib = require('zlib')
const https = require('https')
const isGzip = require('is-gzip')
const isDeflate = require('is-deflate')
const performanceNow = require('performance-now')

const EMPTY_OBJECT = Object.freeze({})
const EMPTY_BUFFER = Buffer.alloc(0)

const getHeader = (headers, search) => {
  search = search.toLowerCase()

  for (let [name, value] of Object.entries(headers)) {
    if (name.toLowerCase() == search) {
      if (Array.isArray(value)) {
        return value[0]
      } else {
        return value
      }
    }
  }
}

let gunzipAsync

try {
  gunzipAsync = util.promisify(zlib.gunzip.bind(zlib))
} catch (e) {
  gunzipAsync = (input) => input
}

let deflateAsync

try {
  deflateAsync = util.promisify(zlib.deflate.bind(zlib))
} catch (e) {
  deflateAsync = (input) => input
}

let brotliDecompressAsync

try {
  brotliDecompressAsync = util.promisify(zlib.brotliDecompress.bind(zlib))
} catch (e) {
  brotliDecompressAsync = (input) => input
}

const transport = {
  'http:': http,
  'https:': https,
}

const closeRequestAndCleanup = async (req) => {
  try {
    // NOTE: force socket closure just in case

    req.socket.destroy()
  } catch (e) {}

  try {
    req.destroy()
  } catch (e) {}
}

const maybeUnzip = async (buf, headers) => {
  try {
    // NOTE: guard against acidental problems as the method does not ensure decompression

    const contentEncoding = (getHeader(headers, 'content-encoding') || '')
      .toLowerCase()
      .trim()

    switch (contentEncoding) {
      case 'gzip':
        return await gunzipAsync(buf, {
          finishFlush: zlib.constants.Z_FULL_FLUSH,
        })

      case 'deflate':
        return await deflateAsync(buf, {
          finishFlush: zlib.constants.Z_FULL_FLUSH,
        })

      case 'br':
        return await brotliDecompressAsync(buf, {
          finishFlush: zlib.constants.Z_FULL_FLUSH,
        })
    }

    if (isGzip(buf)) {
      return await gunzipAsync(buf, {
        finishFlush: zlib.constants.Z_FULL_FLUSH,
      })
    } else if (isDeflate(buf)) {
      return await deflateAsync(buf, {
        finishFlush: zlib.constants.Z_FULL_FLUSH,
      })
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(e)
    }
  }

  return buf
}

const requestInternal = (request, resolve, followCount = 0) => {
  const {
    type = 'base',
    method = 'GET',
    uri,
    version = 'HTTP/1.1',
    headers: _headers = EMPTY_OBJECT,
    body,
    info,
    timeout = 30000,
    connectTimeout = timeout,
    dataTimeout = timeout,
    follow = false,
    followLimit = 10,
    download = true,
    downloadLimit = Infinity,
    certificate = false,
    correctHeaders = true,
    rejectUnauthorized = true,
    client,
    ...rest
  } = request

  const headers = { ..._headers }

  if (body && body.length) {
    if (
      correctHeaders &&
      !getHeader(headers, 'transfer-encoding') &&
      !getHeader(headers, 'content-length')
    ) {
      headers['content-length'] = body.length
    }
  }

  const now = performanceNow()

  const transaction = {
    type,

    method,
    uri,
    version,
    headers,
    body,

    responseVersion: version,
    responseCode: 0,
    responseMessage: '',
    responseHeaders: EMPTY_OBJECT,
    responseBody: EMPTY_BUFFER,

    info: {
      ...info,

      startTime: now,
      stopTime: now,
    },
  }

  const responseBodyDataChunks = []

  const options = {
    ...rest,

    ...url.parse(uri),

    method,
    headers,

    rejectUnauthorized,
  }

  if (!transport[options.protocol]) {
    throw new Error(`Unsupported transport ${options.protocol}`)
  }

  const req = (client || transport[options.protocol]).request(options)

  let connectTimeoutHandler
  let dataTimeoutHandler

  if (connectTimeout) {
    req.setTimeout(connectTimeout)

    connectTimeoutHandler = setTimeout(() => {
      req.emit('timeout')
    }, connectTimeout)
  }

  const createErrorHandler = (errorType) => {
    return async (error) => {
      clearTimeout(connectTimeoutHandler)
      clearTimeout(dataTimeoutHandler)

      await closeRequestAndCleanup(req)

      if (!resolve) {
        return
      }

      const localResolve = resolve

      resolve = null

      error = error || new Error(errorType)

      transaction.info.error = error
      transaction.info.stopTime = performanceNow()
      transaction.responseBody = await maybeUnzip(
        Buffer.concat(responseBodyDataChunks),
        transaction.responseHeaders || {}
      )

      localResolve(transaction)
    }
  }

  req.on('response', async (res) => {
    clearTimeout(connectTimeoutHandler)

    if (certificate && options.protocol == 'https:') {
      try {
        transaction.info.certificate = res.connection.getPeerCertificate()
      } catch (e) {}
    }

    transaction.responseCode = res.statusCode
    transaction.responseMessage = res.statusMessage
    transaction.responseHeaders = res.headers

    if (
      follow &&
      res.statusCode >= 300 &&
      res.statusCode < 400 &&
      res.headers.location
    ) {
      if (followCount < followLimit) {
        await closeRequestAndCleanup(req)

        requestInternal(
          {
            ...request,
            uri: url.resolve(transaction.uri, res.headers.location),
          },
          resolve,
          followCount + 1
        )

        return
      } else {
        await closeRequestAndCleanup(req)

        if (!resolve) {
          return
        }

        const localResolve = resolve

        resolve = null

        const error = new Error('Redirect Loop')

        transaction.info.error = error
        transaction.info.stopTime = performanceNow()
        transaction.responseBody = await maybeUnzip(
          Buffer.concat(responseBodyDataChunks),
          transaction.responseHeaders || {}
        )

        localResolve(transaction)

        return
      }
    }

    if (!download) {
      await closeRequestAndCleanup(req)

      if (!resolve) {
        return
      }

      const localResolve = resolve

      resolve = null

      transaction.info.stopTime = performanceNow()
      transaction.responseBody = EMPTY_BUFFER

      localResolve(transaction)

      return
    }

    res.on('timeout', createErrorHandler('Timeout'))

    res.on('aborted', createErrorHandler('Aborted'))

    res.on('abort', createErrorHandler('Abort'))

    res.on('error', createErrorHandler('Error'))

    if (dataTimeout) {
      dataTimeoutHandler = setTimeout(() => {
        res.emit('timeout')
      }, dataTimeout)
    }

    let downloadSize = 0

    res.on('data', async (data) => {
      clearTimeout(dataTimeoutHandler)

      responseBodyDataChunks.push(data)

      downloadSize += data.length

      if (downloadSize <= downloadLimit) {
        if (dataTimeout) {
          dataTimeoutHandler = setTimeout(() => {
            res.emit('timeout')
          }, dataTimeout)
        }
      } else {
        await closeRequestAndCleanup(req)
      }
    })

    res.on('end', async () => {
      clearTimeout(dataTimeoutHandler)

      await closeRequestAndCleanup(req)

      if (!resolve) {
        return
      }

      const localResolve = resolve

      resolve = null

      transaction.info.stopTime = performanceNow()
      transaction.responseBody = await maybeUnzip(
        Buffer.concat(responseBodyDataChunks),
        transaction.responseHeaders
      )

      localResolve(transaction)
    })
  })

  req.on('timeout', createErrorHandler('Timeout'))

  req.on('aborted', createErrorHandler('Aborted'))

  req.on('abort', createErrorHandler('Abort'))

  req.on('error', createErrorHandler('Error'))

  req.end(body)
}

const request = (request) =>
  new Promise((resolve, reject) => {
    try {
      // all paths are happy paths

      requestInternal(request, resolve)
    } catch (e) {
      reject(e)
    }
  })

module.exports = { request }
