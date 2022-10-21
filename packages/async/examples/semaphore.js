const { sleep } = require('../lib/sleep')
const { Semaphore } = require('../lib/semaphore')

const main = async () => {
  const concurency = 5

  const semaphore = new Semaphore(concurency)

  let item = 0

  await Promise.all(
    Array(concurency)
      .fill(0)
      .map(async () => {
        for (;;) {
          const localItem = (item += 1)

          const release = await semaphore.acquire()

          console.log(`processing item`, localItem)

          if (localItem % concurency == 0) {
            console.log('---')
          }

          release(sleep(1000))
        }
      })
  )

  await semaphore.join()
}

main()
