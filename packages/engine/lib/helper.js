const { ensureArray } = require('./util.js')
const { Template } = require('./template.js')

/**
 * @typedef {import('./template.js').TaskResult} TaskResult
 * @typedef {import('./template.js').Task} Task
 * @typedef {import('./template.js').Input} Input
 * 
 * @typedef {{
 *  [taskName: string]: {
 *    alias?: string|string[]
 *    aliases?: string|string[]
 *    run?: (task: Task, input: Input, ...args: any) => void|TaskResult|Promise<void>|Promise<TaskResult>
 *    handle?: (task: Task, input: Input, ...args: any) => void|TaskResult|Promise<void>|Promise<TaskResult>
 *    handler?: (task: Task, input: Input, ...args: any) => void|TaskResult|Promise<void>|Promise<TaskResult>
 *  }
 * }} TaskDefinition
 */

/**
 * 
 * @param {TaskDefinition} definition 
 * @returns {typeof Template}
 */
const createSuperTemplate = (definition) => {
    const map = {}

    Object.entries(definition).forEach(([name, handler]) => {
        if (typeof(handler) === 'function') {
            map[name] = { name, run: handler }
        }
        else {
            map[name] = { name, run: handler.run || handler.handle || handler.handler }
        }
        
        // TODO: simplify with auto-alias generation

        [].concat(ensureArray(handler.alias), ensureArray(handler.aliases)).forEach((alias) => {
            alias = alias.trim()

            if (alias) {
                map[alias] = { name, run: map[name].run }
            }
        })
    })

    return class extends Template {
        constructor(template, options) {
            super(template, options)

            this.map = map
        }

        async executeTask(taskName, task, input = {}, ...args) {
            const taskDefinition = this.map[taskName]

            if (!taskDefinition) {
                throw new Error(`Unrecognized task ${taskName}`)
            }

            return taskDefinition.run.call(this, task, input, ...args)
        }

        async runTask(taskName, task, input = {}, ...args) {
            const taskDefinition = this.map[taskName]

            if (!taskDefinition) {
                throw new Error(`Unrecognized task ${taskName}`)
            }

            taskName = taskDefinition.name

            return super.runTask(taskName, task, input, ...args)
        }

        async * runTaskSetIt(taskName, tasks, input = {}, ...args) {
            if (['op', 'ops', 'operation', 'operations'].includes(taskName)) {
                for (let task of tasks) {
                    yield* this.runTaskDefinitionsIt(task, input, ...args)
                }
            }
            else {
                yield* super.runTaskSetIt(taskName, tasks, input, ...args)
            }
        }
    }
}

module.exports = {
    createSuperTemplate
}
