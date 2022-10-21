const { Mutex } = require('./mutex')

class Semaphore {
    constructor(rooms = 1) {
        this.rooms = rooms
        this.tasks = {}

        this.internalId = 0
    }

    async acquire() {
        while (Object.keys(this.tasks).length >= this.rooms) {
            await Promise.race(Object.values(this.tasks))
        }

        const taskId = this.internalId += 1

        const task = new Mutex()

        this.tasks[taskId] = task.lock()

        return async(promise) => {
            try {
                if (promise) {
                    if (typeof(promise) === 'function') {
                        await promise()
                    }
                    else {
                        await promise
                    }
                }
            }
            finally {
                delete this.tasks[taskId]

                task.unlock(taskId)
            }
        }
    }

    async join() {
        for (;;) {
            await Promise.all(Object.values(this.tasks))

            if (!this.tasks.size) {
                break
            }
        }
    }
}

module.exports = { Semaphore }
