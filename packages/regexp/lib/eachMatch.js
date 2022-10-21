const eachMatch = function*(regexp, input) {
    if (process.env.NODE_ENV !== 'production') {
        if (!regexp.global) {
            throw new Error(`Regex ${regexp} does not have global flag`)
        }
    }

    let match

    while ((match = regexp.exec(input)) !== null) {
        yield match
    }
}

module.exports = { eachMatch }
