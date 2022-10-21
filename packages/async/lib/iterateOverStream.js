const iterateOverStream = async function*(stream, handler) {
    if (!handler) {
        handler = chunk => chunk
    }

    for await (const chunk of stream) {
        yield await handler(chunk)
    }
}

module.exports = { iterateOverStream }
