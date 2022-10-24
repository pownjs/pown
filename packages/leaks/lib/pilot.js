const { eachMatch } = require('@pown/regexp/lib/eachMatch')

class Pilot {
  constructor(options) {
    const { database, title = '', severity = 0 } = options || {}

    this.database = database
    this.title = title
    this.severity = severity
  }

  async *generateChecks(options) {
    const { title = this.title, severity = this.severity } = options || {}

    const tests = []

    if (title) {
      tests.push((check) => {
        return (
          (check.title || '').toLowerCase().indexOf(title.toLowerCase()) >= 0
        )
      })
    }

    tests.push((check) => {
      return (check.severity || 10) >= severity
    })

    for (const category of Object.values(this.database)) {
      const { checks } = category

      for (const check of checks) {
        if (tests.every((f) => f(check))) {
          yield check
        }
      }
    }
  }

  async *iterateOverSearch(input, options) {
    for await (const check of this.generateChecks(options)) {
      if (process.env.POWN_DEBUG_XXL) {
        console.debug(`starting check ${check.title}`)
        console.time(`leaks: check ${check.title}`)
      }

      const { scan } = check

      if (scan) {
        for (let { index, exact, find, entropy } of scan(input, options)) {
          yield { check, index, exact, find, entropy }
        }
      } else {
        throw new Error(`Unexpected state`)
      }

      if (process.env.POWN_DEBUG_XXL) {
        console.timeEnd(`leaks: check ${check.title}`)
      }
    }
  }

  async *iterateOverSearchPerCodeLine(input, options) {
    const {
      tokenizer = /(.+?)[\n]*$/gm,
      trimToMaxLineSize = false,
      maxLineSize = 512,
      maxLinePadding = 64,
      breakOnLineMatch = false,
    } = options || {}

    for await (let match of eachMatch(tokenizer, input)) {
      let { index, 1: line } = match

      if (trimToMaxLineSize) {
        line = line.substring(0, maxLineSize)
      }

      for await (let submatch of this.iterateOverSearch(line, options)) {
        if (line.length > maxLineSize) {
          line = line.substring(
            Math.max(0, submatch.index - maxLinePadding),
            submatch.index + submatch.find.length + maxLinePadding
          )
        }

        yield { ...submatch, line, index: index + submatch.index }

        if (breakOnLineMatch) {
          break
        }
      }
    }
  }
}

module.exports = { Pilot }
