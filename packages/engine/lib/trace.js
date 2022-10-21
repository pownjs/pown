const util = require('util')

/**
 * @typedef {{
 *  message: string
 *  data: Record<string,any>
 *  ts: number
 * }} TraceStep
 */

class Tracer {
    constructor() {
        this.trace = /** @type {TraceStep[]} */([])
    }

    /**
     * 
     * @param {string} message
     * @param {Record<String,any>} [data] 
     */
    push(message, data = {}) {
        this.trace.push({message, data, ts: Date.now()})
    }

    /**
     * 
     * returns {TraceStep[]}
     */
    getTrace() {
        return this.trace
    }
}

class ConsoleTracer extends Tracer {
    /**
     * 
     * @param {string} message
     * @param {Record<String,any>} [data] 
     */
    push(message, data = {}) {
        if (process.env.DEBUG) {
            console.debug(`* [${Date.now()}]`, message, util.inspect(data, { colors: true, depth: Infinity }))
        }
        else {
            console.info(`* [${Date.now()}]`, message)
        }

        super.push(message, data)
    }
}

module.exports = {
    Tracer,
    ConsoleTracer
}
