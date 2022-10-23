const { Mutex } = require('../lib/mutex')

const main = async () => {
  const mutex = new Mutex()

  setTimeout(() => {
    mutex.unlock()
  }, 5000)

  console.log('locked')

  await mutex.lock()

  console.log('unlocked')
}

main().catch(console.error)
