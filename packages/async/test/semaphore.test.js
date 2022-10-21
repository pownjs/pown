const assert = require('assert')

const { sleep } = require('../lib/sleep')
const { Semaphore } = require('../lib/semaphore')

describe('semaphore', () => {
    describe('#acquire', () => {
        it('acquires at 1 room', async() => {
            const semaphore = new Semaphore(1)

            const r1 = await semaphore.acquire()

            r1()

            const r2 = await semaphore.acquire()

            r2()

            const r3 = await semaphore.acquire()

            r3()

            assert.ok(true, 'done')
        })
    })

    describe('#acquire', () => {
        it('acquires at 1 room with release promises', async() => {
            const semaphore = new Semaphore(1)

            const r1 = await semaphore.acquire()

            r1(sleep(300))

            const r2 = await semaphore.acquire()

            r2(sleep(300))

            const r3 = await semaphore.acquire()

            r3(sleep(300))

            assert.ok(true, 'done')
        }).timeout(1000)
    })
})
