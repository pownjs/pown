const { generateOfParallel } = require('@pown/async/lib/generateOfParallel')

const { listAlienVaultURIs } = require('./alienvault')
const { listWebArchiveURIs } = require('./webarchive')
const { listCommonCrawlURIs } = require('./commoncrawl')

const sg = async function*(generator) {
    try {
        yield* generator
    }
    catch (e) {}
}

const listURIs = async function*(domain, { safeGenerator = sg, ...options } = {}) {
    yield* generateOfParallel([listAlienVaultURIs, listWebArchiveURIs, listCommonCrawlURIs].map(f => safeGenerator(f(domain, options))))
}

module.exports = { listURIs }
