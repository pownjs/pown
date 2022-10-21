const request = require('../lib/request')

const assert = require('assert')

describe('request', () => {
  describe('#request', () => {
    it('must request http request', async () => {
      const tran = await request.request({ uri: 'http://httpbin.org/get' })

      const { responseBody } = tran

      const { url } = JSON.parse(responseBody.toString())

      assert.equal(url, 'http://httpbin.org/get')
    })

    it('must request https request', async () => {
      const tran = await request.request({ uri: 'https://httpbin.org/get' })

      const { responseBody } = tran

      const { url } = JSON.parse(responseBody.toString())

      assert.equal(url, 'https://httpbin.org/get')
    })

    it('must not download body', async () => {
      const tran = await request.request({
        uri: 'http://httpbin.org/get',
        download: false,
      })

      const { responseBody } = tran

      assert.equal(responseBody.length, 0)
    })

    it('must redirect', async () => {
      const tran = await request.request({
        uri: 'https://httpbin.org/status/302',
        follow: true,
      })

      const { responseCode } = tran

      assert.notEqual(responseCode, 302)
    })
  })

  describe('timeout harness', async () => {
    it('must timeout', async function () {
      this.timeout(4000)

      await request.request({ uri: 'https://twilio.com:9443', timeout: 3000 })
    })
  })
})
