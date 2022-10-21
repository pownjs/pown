const nextTick = () => {
    return new Promise((resolve) => {
        process.nextTick(resolve)
    })
}

module.exports = { nextTick }
