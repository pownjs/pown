const { Scheduler: PownScheduler } = require('@pown/request/lib/scheduler')

class Scheduler extends PownScheduler {
  /**
   * The Pown Scheduler does not throw in normal circumstances no matter the
   * error. This method changes this behaviour slightly. Error is thrown when
   * the response contains an error or even when the response code itself is
   * an error, i.e. 500. This is done in order to minimise further error
   * checking when programming a transform. If the request contains and error
   * the transform will simply bail out by the means of the exception.
   *
   * It is tempting to overload the request method but we do not do that here
   * because the scheduler could be used by other libraries and as a result this
   * specific behaviour might be unexpected side-effect.
   */
  async tryRequest(request) {
    if (request.headers && !request.headers['user-agent']) {
      request = {
        ...request,

        headers: { ...request.headers, 'user-agent': 'pown' },
      }
    }

    const response = await this.request(request)

    if (response.info.error) {
      // NOTE: in the context of Recon the scheduler also prints error messages for better monitoring of complex tasks

      console.error(
        `${response.method || 'GET'}`,
        response.uri,
        '->',
        response.info.error
      )

      // NOTE: as per the above, we throw errors to bail out as soon as we can

      throw response.info.error
    } else {
      console.debug(
        `${response.method || 'GET'}`,
        response.uri,
        '->',
        response.responseCode,
        Buffer.from(response.responseBody).slice(0, 512).toString('base64')
      )
    }

    if (response.responseCode < 200 || response.responseCode > 299) {
      // NOTE: as per the above, we throw errors to bail out as soon as we can

      throw new Error(
        `Cannot request ${response.method} ${response.uri} -> ${response.responseCode}`
      )
    }

    if (request.toJson || request.toJSON) {
      return JSON.parse(response.responseBody)
    } else {
      return response
    }
  }
}

module.exports = { Scheduler }
