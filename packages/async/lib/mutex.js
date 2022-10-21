class Mutex {
  lock() {
    if (this.unlock) {
      throw new Error(`Already locked`)
    }

    return new Promise((resolve) => {
      this.unlock = (value) => {
        delete this.unlock

        resolve(value)
      }
    })
  }
}

module.exports = { Mutex }
