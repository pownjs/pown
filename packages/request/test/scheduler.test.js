const { Scheduler, SystemScheduler } = require('../lib/scheduler')

const assert = require('assert')

describe('scheduler', () => {
  describe('#request', () => {
    const scheduler = new Scheduler()

    it('must fetch http request', async () => {
      const tran = await scheduler.request({ uri: 'http://httpbin.org/get' })

      const { responseBody } = tran

      const { url } = JSON.parse(responseBody.toString())

      assert.equal(url, 'http://httpbin.org/get')
    })

    it('must fetch https request', async () => {
      const tran = await scheduler.request({ uri: 'https://httpbin.org/get' })

      const { responseBody } = tran

      const { url } = JSON.parse(responseBody.toString())

      assert.equal(url, 'https://httpbin.org/get')
    })

    it('must fetch with a pause between requests', async () => {
      await scheduler.request({ uri: 'https://httpbin.org/get' })

      scheduler.pause()

      const promise2 = scheduler.request({ uri: 'https://httpbin.org/get' })
      const promise3 = scheduler.request({ uri: 'https://httpbin.org/get' })

      scheduler.resume()

      await Promise.all([promise2, promise3])
    })
  })
})

describe('systemScheduler', () => {
  describe('#request', () => {
    const scheduler = new SystemScheduler()

    it('must request http request', async () => {
      const tran = await scheduler.request({ uri: 'http://httpbin.org/get' })

      const { responseBody } = tran

      const { url } = JSON.parse(responseBody.toString())

      assert.equal(url, 'http://httpbin.org/get')
    })

    it('must fetch https request', async () => {
      const tran = await scheduler.request({ uri: 'https://httpbin.org/get' })

      const { responseBody } = tran

      const { url } = JSON.parse(responseBody.toString())

      assert.equal(url, 'https://httpbin.org/get')
    })
  })
})
