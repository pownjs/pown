const { sleep } = require('../lib/sleep')
const { eachOfLimit } = require('../lib/eachOfLimit')

const main = async () => {
  const concurency = 5

  const generator = async function* () {
    let i = 1

    for (;;) {
      yield i++
    }
  }

  eachOfLimit(
    generator(),
    async (item) => {
      console.log(`processing item`, item)

      if (item % concurency == 0) {
        console.log('---')
      }

      await sleep(1000)
    },
    concurency
  )
}

main().catch(console.error)
