const jsonPath = require('jsonpath')
const deepmerge = require('deepmerge')
const staticEval = require('static-eval')
const esprima = require('nightly-esprima')
const { RegExp } = require('@pown/regexp')

const { Tracer } = require('./trace.js')
const { calculateEntropy } = require('./entropy.js')
const { asyncEvery, asyncSome, asyncNone } = require('./async.js')
const {
  ensureArray,
  ensureObject,
  btoa,
  atob,
  dict,
  list,
  ret,
} = require('./util.js')

/**
 * @typedef {Record<string,any>} Input
 */

/**
 * @typedef {Record<string,any>} Output
 */

/**
 * @typedef {'and'|'or'|'not'|'all'|'every'|'any'|'some'|'none'} MatcherCondition
 *
 * @typedef {string} StringMatcher
 *
 * @typedef {{
 *  type?: 'lt'|'lessthan'|'gt'|'greaterthan'|'lte'|'lessthanorequal'|'gte'|'greaterthanorequal'|'eq'|'equal'|'number'|'string'|'word'|'words'|'regex'|'b64'|'base64'|'entropy'|'script'
 *  negative?: boolean
 *  not?: boolean
 *  part?: string
 *  condition?: MatcherCondition
 *  lt?: number
 *  lessthan?: number
 *  gt?: number
 *  greaterthan?: number
 *  lte?: number
 *  lessthanorequal?: number
 *  gte?: number
 *  greaterthanorequal?: number
 *  eq?: any
 *  equal?: any
 *  number?: number
 *  string?: string
 *  word?: string
 *  words?: string
 *  regex?: string
 *  flag?: string
 *  flags?: string
 *  b64?: string
 *  base64?: string
 *  entropy?: number
 *  script?: string
 * }} DetailedMatcher
 *
 * @typedef {StringMatcher|DetailedMatcher} Matcher
 *
 * @typedef {{
 *  match?: Matcher|Matcher[]
 *  matches?: Matcher|Matcher[]
 *  matcher?: Matcher|Matcher[]
 *  matchers?: Matcher|Matcher[]
 *  ['match-condition']?: MatcherCondition
 *  ['matches-condition']?: MatcherCondition
 *  ['matcher-condition']?: MatcherCondition
 *  ['matchers-condition']?: MatcherCondition
 *  matchcondition?: MatcherCondition
 *  matchescondition?: MatcherCondition
 *  matchercondition?: MatcherCondition
 *  matcherscondition?: MatcherCondition
 * }} MatcherTask
 */

/**
 * @typedef {string} StringExtractor
 *
 * @typedef {{
 *  type?: 'value'|'jsonpath'|'regex'|'script'
 *  part?: string
 *  name?: string
 *  value?: any
 *  jsonpath?: string
 *  path?: string
 *  regex?: string
 *  flag?: string
 *  flags?: string
 *  group?: string
 *  script?: string
 * }} DetailedExtractor
 *
 * @typedef {StringExtractor|DetailedExtractor} Extractor
 *
 * @typedef {{
 *  extract?: Extractor|Extractor[]
 *  extracts?: Extractor|Extractor[]
 *  extractor?: Extractor|Extractor[]
 *  extractors?: Extractor|Extractor[]
 * }} ExtractorTask
 */

/**
 * @typedef {Record<string,any>} Task
 */

/**
 * @typedef {{
 *  id?: string
 *  name: string
 *  result?: Record<string,any>
 *  error?: Error
 *  input: Input
 *  matches: boolean
 *  extracts: Record<string,any>
 *  output: Output
 * }} TaskResult
 */

/**
 * @typedef {{
 *  id?: string
 *  input: Input
 *  tasks: TaskResult[]
 *  output: Output
 * }} Execution
 */

class Template {
  /**
   *
   * @param {Record<string,any>} template
   * @param {{tracer?: Tracer}} [options]
   */
  constructor(template, options) {
    this.template = template

    this.tracer = options?.tracer || new Tracer()
  }

  // ---

  /**
   *
   * @param {any} input
   * @returns {boolean}
   */
  isBoolean(input) {
    return typeof input === 'boolean' || input instanceof Boolean
  }

  /**
   *
   * @param {any} input
   * @returns {boolean}
   */
  isNumber(input) {
    return typeof input === 'number' || input instanceof Number
  }

  /**
   *
   * @param {any} input
   * @returns {boolean}
   */
  isString(input) {
    return typeof input === 'string' || input instanceof String
  }

  /**
   *
   * @param {any} input
   * @returns {boolean}
   */
  isBuffer(input) {
    return Buffer.isBuffer(input)
  }

  /**
   *
   * @param {any} input
   * @returns {boolean}
   */
  isArray(input) {
    return Array.isArray(input)
  }

  // ---

  /**
   *
   * @param {Record<string,any>} object
   * @param {string} path
   * @returns {any}
   */
  query(object, path) {
    if (!path.startsWith('$')) {
      path = `$.${path}`
    }

    return jsonPath.value(object, path)
  }

  /**
   *
   * @param {Record<string,any>} object
   * @param {string} path
   * @param {any} value
   * @returns {any}
   */
  assign(object, path, value) {
    const root = object
    const parts = path.split('.')

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]

      if (!object[part]) {
        object = object[part] = {}
      }
    }

    object[parts[parts.length - 1]] = value

    return root
  }

  // ---

  /**
   *
   * @param {Record<string,any>} scope
   * @returns {Record<string,any>}
   */
  getEvaluationScope(scope) {
    return {
      ...scope,

      JSON,

      Math,

      encodeURI,
      decodeURI,

      encodeURIComponent,
      decodeURIComponent,

      escape,
      unescape,

      btoa,
      atob,

      dict,
      list,

      ret,

      entropy: calculateEntropy,
    }
  }

  /**
   *
   * @param {string} script
   * @param {Record<string,any>} scope
   * @returns {any}
   */
  evaluate(script, scope) {
    return staticEval(
      esprima.parse(script || 'false').body[0].expression,
      this.getEvaluationScope(scope)
    )
  }

  // ---

  interpolate(input, scope) {
    if (this.isBoolean(input) || this.isNumber(input)) {
      return input
    }
    if (this.isString(input)) {
      return input
        .split(/(\$\{.+?\})/g)
        .map((token) => {
          if (token.startsWith('${') && token.endsWith('}')) {
            return this.evaluate(token.slice(2, -1), scope)
          } else {
            return token
          }
        })
        .join('')
    } else if (this.isBuffer(input)) {
      return Buffer.from(this.interpolate(Buffer.toString(), scope))
    } else if (this.isArray(input)) {
      return input.map((input) => this.interpolate(input, scope))
    } else {
      return Object.entries(input).reduce((output, [key, value]) => {
        output[key] = this.interpolate(value, scope)

        return output
      }, {})
    }
  }

  // ---

  /**
   *
   * @param {AsyncIterable<any>} items
   * @returns {Promise<any[]>}
   */
  async toArray(items) {
    const results = []

    for await (let item of items) {
      results.push(item)
    }

    return results
  }

  // ---

  async getTaskDefinition(task) {
    const {
      id,

      match,
      matches,
      matcher,
      matchers,
      ['match-condition']: mc,
      ['matches-condition']: msc,
      ['matcher-condition']: mrc,
      ['matchers-condition']: mrsc,
      matchCondition = mc,
      matchesCondition = msc,
      matcherCondition = mrc,
      matchersCondition = mrsc,

      extract,
      extracts,
      extractor,
      extractors,

      ...definition
    } = task

    id

    match
    matches
    matcher
    matchers
    mc
    msc
    mrc
    mrsc
    matchCondition
    matchesCondition
    matcherCondition
    matchersCondition

    extract
    extracts
    extractor
    extractors

    return definition
  }

  // ---

  /**
   *
   * @param {MatcherCondition} condition
   * @returns {(it: Iterable<any>, handler: import('./async.js').Handler) => Promise<boolean>}
   */
  getTestConditionFunc(condition) {
    return (
      {
        all: asyncEvery,
        any: asyncSome,

        every: asyncEvery,
        some: asyncSome,
        none: asyncNone,

        and: asyncEvery,
        or: asyncSome,
        not: asyncNone,
      }[condition] || asyncEvery
    )
  }

  /**
   *
   * @param {Matcher} matcher
   * @param {any} input
   * @returns {Promise<boolean>}
   */
  async test(matcher, input) {
    if (this.isString(matcher)) {
      return this.evaluate(/** @type {StringMatcher} */ (matcher), input)
    } else {
      const {
        part,
        condition,
        lt,
        lessthan,
        gt,
        greaterthan,
        lte,
        lessthanorequal,
        gte,
        greaterthanorequal,
        eq,
        equal,
        number,
        string,
        word,
        words,
        regex,
        flag,
        flags,
        b64,
        base64,
        entropy,
        script,
      } = /** @type {DetailedMatcher} */ (matcher)

      if (part) {
        input = this.query(input, part || '')
      }

      let { type } = /** @type {DetailedMatcher} */ (matcher)

      if (!type) {
        if (lt || lessthan) {
          type = 'lessthan'
        } else if (gt || greaterthan) {
          type = 'greaterthan'
        } else if (lte || lessthanorequal) {
          type = 'lessthanorequal'
        } else if (gte || greaterthanorequal) {
          type = 'greaterthanorequal'
        } else if (eq || equal || number) {
          type = 'number'
        } else if (string || word || words) {
          type = 'string'
        } else if (regex) {
          type = 'regex'
        } else if (b64 || base64) {
          type = 'b64'
        } else if (entropy) {
          type = 'entropy'
        } else if (script) {
          type = 'script'
        }
      }

      switch (type) {
        case 'lt':
        case 'lessthan':
          return this.getTestConditionFunc(condition)(
            ensureArray(eq || equal || number || NaN),
            (number) => {
              number = parseInt(number)

              return !isNaN(number) && input > number
            }
          )

        case 'gt':
        case 'greaterthan':
          return this.getTestConditionFunc(condition)(
            ensureArray(eq || equal || number || NaN),
            (number) => {
              number = parseInt(number)

              return !isNaN(number) && input < number
            }
          )

        case 'lte':
        case 'lessthanorequal':
          return this.getTestConditionFunc(condition)(
            ensureArray(eq || equal || number || NaN),
            (number) => {
              number = parseInt(number)

              return !isNaN(number) && input >= number
            }
          )

        case 'gte':
        case 'greaterthanorequal':
          return this.getTestConditionFunc(condition)(
            ensureArray(eq || equal || number || NaN),
            (number) => {
              number = parseInt(number)

              return !isNaN(number) && input <= number
            }
          )

        case 'eq':
        case 'equal':
        case 'number':
          return this.getTestConditionFunc(condition)(
            ensureArray(eq || equal || number || NaN),
            (number) => {
              number = parseInt(number)

              return !isNaN(number) && input === number
            }
          )

        case 'string':
        case 'word':
        case 'words':
          if (this.isString(input) || this.isBuffer(input)) {
            return this.getTestConditionFunc(condition)(
              ensureArray(word || words || ''),
              (word) => {
                return input.indexOf(word) >= 0
              }
            )
          } else {
            return false
          }

        case 'regex':
          if (this.isString(input) || this.isBuffer(input)) {
            return this.getTestConditionFunc(condition)(
              ensureArray(regex || ''),
              (regex) => {
                const r = new RegExp(regex, flag || flags || '')

                return r.test(input)
              }
            )
          } else {
            return false
          }

        case 'b64':
        case 'base64':
          if (this.isString(input)) {
            return this.getTestConditionFunc(condition)(
              ensureArray(b64 || base64 || ''),
              (b64) => {
                const search = Buffer.from(b64, 'base64').toString()

                return input.indexOf(search) >= 0
              }
            )
          } else if (this.isBuffer(input)) {
            return this.getTestConditionFunc(condition)(
              ensureArray(b64 || base64 || ''),
              (b64) => {
                const search = Buffer.from(b64, 'base64')

                return input.indexOf(search) >= 0
              }
            )
          } else {
            return false
          }

        case 'entropy':
          if (this.isString(input) || this.isBuffer(input)) {
            return calculateEntropy(input) >= entropy
          } else {
            return false
          }

        case 'script':
          return this.getTestConditionFunc(condition)(
            ensureArray(script || ''),
            (script) => {
              return this.evaluate(script, input)
            }
          )
      }

      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Invalid matcher type ${type}`)
      }

      return false
    }
  }

  // ---

  /**
   *
   * @param {Matcher} matcher
   * @param {any} input
   * @returns {Promise<boolean>}
   */
  async match(matcher, input) {
    if (this.isString(matcher)) {
      return this.test(matcher, input)
    } else {
      const { negative, not, ...rest } = /** @type {DetailedMatcher} */ (
        matcher
      )

      if (negative || not) {
        return !this.test(rest, input)
      } else {
        return this.test(rest, input)
      }
    }
  }

  /**
   *
   * @param {MatcherTask} task
   * @param {any} input
   * @returns {Promise<boolean>}
   */
  async matchWithTask(task, input) {
    const {
      match,
      matches,
      matcher,
      matchers,

      ['match-condition']: mc,
      ['matches-condition']: msc,
      ['matcher-condition']: mrc,
      ['matchers-condition']: mrsc,

      matchcondition = mc,
      matchescondition = msc,
      matchercondition = mrc,
      matcherscondition = mrsc,
    } = task

    const m = ensureArray(match || matches || matcher || matchers)

    const c =
      matchcondition ||
      matchescondition ||
      matchercondition ||
      matcherscondition ||
      'and'

    const f = this.getTestConditionFunc(c)

    this.tracer.push(`Matching task`, { task, input })

    const r = await f(m, (m) => this.match(m, input))

    this.tracer.push(`Task matched: ${r}`, { task, input })

    return r
  }

  // ---

  /**
   *
   * @param {Extractor} extractor
   * @param {Input} input
   * @returns {Promise<Record<string,any>>}
   */
  async extract(extractor, input) {
    if (this.isString(extractor)) {
      return this.evaluate(/** @type {StringExtractor} */ (extractor), input)
    } else {
      const {
        part,
        name,
        value,
        jsonpath,
        path,
        regex,
        flag,
        flags,
        group,
        script,
      } = /** @type {DetailedExtractor} */ (extractor)

      if (part && !this.isString(input)) {
        input = this.query(input, part || '$')
      }

      let { type } = /** @type {DetailedExtractor} */ (extractor)

      if (!type) {
        if (value || jsonpath) {
          type = 'value'
        } else if (regex) {
          type = 'regex'
        } else if (script) {
          type = 'script'
        }
      }

      switch (type) {
        case 'value':
        case 'jsonpath':
          return this.assign(
            {},
            name || 'value',
            this.query(input, value || jsonpath || path || '$')
          )

        case 'regex':
          if (this.isString(input) || this.isBuffer(input)) {
            const match = new RegExp(regex, flag || flags || '').match(input)

            if (match) {
              return this.assign({}, name || 'value', match[group || 0])
            }
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.debug(`Invalid regex input`)
            }

            return {}
          }

        case 'script':
          return this.evaluate(script, input)
      }

      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Invalid extractor type ${type}`)
      }
    }
  }

  /**
   *
   * @param {ExtractorTask} task
   * @param {Input} input
   * @returns {Promise<Record<string,any>>}
   */
  async extractWithTask(task, input) {
    const { extract, extracts, extractor, extractors } = task

    this.tracer.push(`Extracting task`, { task, input })

    let result = {}

    for (let e of ensureArray(extract || extracts || extractor || extractors)) {
      result = deepmerge(result, await this.extract(e, input))
    }

    this.tracer.push(`Task extracted`, { task, input, result })

    return result
  }

  // ---

  /**
   *
   * @param {string} taskName
   * @param {Task} task
   * @param {Input} input
   * @param {...any} args
   * @returns {Promise<{result: Output}|void>}
   */
  async executeTask(taskName, task, input, ...args) {
    // NOTE: implementors should override this method
  }

  // ---

  /**
   *
   * @param {string} taskName
   * @param {Task} task
   * @param {Input} input
   * @param  {...any} args
   * @returns {Promise<TaskResult>}
   */
  async runTask(taskName, task, input, ...args) {
    // NOTE: implementors can override the method to normalise the task name

    this.tracer.push(`Executing task`, { name: taskName, task, input })

    let result
    let error

    try {
      const taskResult = await this.executeTask(
        taskName,
        await this.getTaskDefinition(task),
        input,
        ...args
      )

      if (taskResult) {
        ;({ result } = taskResult)
      }
    } catch (e) {
      error = e
    }

    if (error) {
      this.tracer.push(`Task execution failed`, { name: taskName, task, error })

      return {
        id: task.id,
        name: taskName,
        result: null,
        error,
        input,
        matches: false,
        extracts: null,
        output: null,
      }
    } else {
      this.tracer.push(`Task execution finished`, {
        name: taskName,
        task,
        input,
        result,
      })

      const matches = await this.matchWithTask(task, result || input)

      let extracts = {}

      let output = ensureObject(input)

      if (matches) {
        extracts = await this.extractWithTask(task, result || input)

        output = deepmerge(output, extracts)
      }

      return {
        id: task.id,
        name: taskName,
        result,
        error,
        input,
        matches,
        extracts,
        output,
      }
    }
  }

  // ---

  async *runTaskSetIt(taskName, tasks, input, ...args) {
    for await (const task of tasks) {
      const result = await this.runTask(taskName, task, input, ...args)

      if (!result) {
        continue
      }

      yield result

      if (!!result.error) {
        return
      }

      if (!result.matches) {
        return
      } else {
        input = result.output
      }
    }
  }

  async runTaskSet(taskName, tasks, input, ...args) {
    return this.toArray(this.runTaskSetIt(taskName, tasks, input, ...args))
  }

  // ---

  /**
   *
   * @param {Task} taskDefinitions
   * @param {Input} input
   * @param  {...any} args
   * @returns {AsyncGenerator<TaskResult>}
   */
  async *runTaskDefinitionsIt(taskDefinitions, input, ...args) {
    for (let [taskName, taskConfig] of Object.entries(taskDefinitions)) {
      for await (let result of this.runTaskSetIt(
        taskName,
        ensureArray(taskConfig),
        input,
        ...args
      )) {
        if (!result) {
          continue
        }

        yield result

        if (!result.matches) {
          return
        } else {
          input = result.output
        }
      }
    }
  }

  /**
   *
   * @param {Task} taskDefinitions
   * @param {Input} input
   * @param  {...any} args
   * @returns {Promise<TaskResult[]>}
   */
  async runTaskDefinitions(taskDefinitions, input, ...args) {
    return await this.toArray(
      this.runTaskDefinitionsIt(taskDefinitions, input, ...args)
    )
  }

  // ---

  /**
   *
   * @param {Input} input
   * @param  {...any} args
   * @returns {AsyncGenerator<TaskResult>}
   */
  async *runIt(input = {}, ...args) {
    const { id, ...tasks } = this.template

    const startedAt = Date.now() // TODO: get nanosecond precision

    this.tracer.push(`Executing template`, {
      id,
      template: this.template,
      input,
    })

    yield* this.runTaskDefinitionsIt(tasks, input, ...args)

    const finishedAt = Date.now() // TODO: get nanosecond precision

    this.tracer.push(`Template execution finished`, {
      id,
      template: this.template,
      input,
      startedAt,
      finishedAt,
    })
  }

  /**
   *
   * @param {Input} input
   * @param  {...any} args
   * @returns {Promise<Execution>}
   */
  async run(input = {}, ...args) {
    const { id } = this.template

    const tasks = await this.toArray(this.runIt(input, ...args))

    const output = (tasks[tasks.length - 1] || {}).output || {}

    return { id, input, tasks, output }
  }
}

module.exports = {
  Tracer,
  Template,
}
