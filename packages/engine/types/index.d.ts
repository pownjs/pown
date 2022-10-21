declare module "lib/trace" {
    export type TraceStep = {
        message: string;
        data: Record<string, any>;
        ts: number;
    };
    /**
     * @typedef {{
     *  message: string
     *  data: Record<string,any>
     *  ts: number
     * }} TraceStep
     */
    export class Tracer {
        trace: TraceStep[];
        /**
         *
         * @param {string} message
         * @param {Record<String,any>} [data]
         */
        push(message: string, data?: Record<string, any>): void;
        /**
         *
         * returns {TraceStep[]}
         */
        getTrace(): TraceStep[];
    }
    export class ConsoleTracer extends Tracer {
    }
}
declare module "lib/entropy" {
    /**
     *
     * @param {string} str
     * @returns {number}
     */
    export function calculateEntropy(str: string): number;
}
declare module "lib/async" {
    export type Handler = (any: any) => boolean | Promise<boolean>;
    /**
     * @typedef {(any: any) => boolean|Promise<boolean>} Handler
     */
    /**
     * @param {Iterable<any>} it
     * @param {Handler} handler
     * @returns {Promise<boolean>}
     */
    export function asyncEvery(it: Iterable<any>, handler: Handler): Promise<boolean>;
    /**
     * @param {Iterable<any>} it
     * @param {Handler} handler
     * @returns {Promise<boolean>}
     */
    export function asyncSome(it: Iterable<any>, handler: Handler): Promise<boolean>;
    /**
     * @param {Iterable<any>} it
     * @param {Handler} handler
     * @returns {Promise<boolean>}
     */
    export function asyncNone(it: Iterable<any>, handler: Handler): Promise<boolean>;
}
declare module "lib/util" {
    export function ensureArray(input: any): any[];
    export function ensureObject(input: any): any;
    export function btoa(input: any): string;
    export function atob(input: any): Buffer;
    export function dict(input: any): any;
    export function list(input: any): any;
    export function ret(input: any): any;
}
declare module "lib/template" {
    export type Input = Record<string, any>;
    export type Output = Record<string, any>;
    export type MatcherCondition = 'and' | 'or' | 'not' | 'all' | 'every' | 'any' | 'some' | 'none';
    export type StringMatcher = string;
    export type DetailedMatcher = {
        type?: 'lt' | 'lessthan' | 'gt' | 'greaterthan' | 'lte' | 'lessthanorequal' | 'gte' | 'greaterthanorequal' | 'eq' | 'equal' | 'number' | 'string' | 'word' | 'words' | 'regex' | 'b64' | 'base64' | 'entropy' | 'script';
        negative?: boolean;
        not?: boolean;
        part?: string;
        condition?: MatcherCondition;
        lt?: number;
        lessthan?: number;
        gt?: number;
        greaterthan?: number;
        lte?: number;
        lessthanorequal?: number;
        gte?: number;
        greaterthanorequal?: number;
        eq?: any;
        equal?: any;
        number?: number;
        string?: string;
        word?: string;
        words?: string;
        regex?: string;
        flag?: string;
        flags?: string;
        b64?: string;
        base64?: string;
        entropy?: number;
        script?: string;
    };
    export type Matcher = StringMatcher | DetailedMatcher;
    export type MatcherTask = {
        match?: Matcher | Matcher[];
        matches?: Matcher | Matcher[];
        matcher?: Matcher | Matcher[];
        matchers?: Matcher | Matcher[];
        ['match-condition']?: MatcherCondition;
        ['matches-condition']?: MatcherCondition;
        ['matcher-condition']?: MatcherCondition;
        ['matchers-condition']?: MatcherCondition;
        matchcondition?: MatcherCondition;
        matchescondition?: MatcherCondition;
        matchercondition?: MatcherCondition;
        matcherscondition?: MatcherCondition;
    };
    export type StringExtractor = string;
    export type DetailedExtractor = {
        type?: 'value' | 'jsonpath' | 'regex' | 'script';
        part?: string;
        name?: string;
        value?: any;
        jsonpath?: string;
        path?: string;
        regex?: string;
        flag?: string;
        flags?: string;
        group?: string;
        script?: string;
    };
    export type Extractor = StringExtractor | DetailedExtractor;
    export type ExtractorTask = {
        extract?: Extractor | Extractor[];
        extracts?: Extractor | Extractor[];
        extractor?: Extractor | Extractor[];
        extractors?: Extractor | Extractor[];
    };
    export type Task = Record<string, any>;
    export type TaskResult = {
        id?: string;
        name: string;
        result?: Record<string, any>;
        error?: Error;
        input: Input;
        matches: boolean;
        extracts: Record<string, any>;
        output: Output;
    };
    export type Execution = {
        id?: string;
        input: Input;
        tasks: TaskResult[];
        output: Output;
    };
    import { Tracer } from "lib/trace";
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
    export class Template {
        /**
         *
         * @param {Record<string,any>} template
         * @param {{tracer?: Tracer}} [options]
         */
        constructor(template: Record<string, any>, options?: {
            tracer?: Tracer;
        });
        template: Record<string, any>;
        tracer: Tracer;
        /**
         *
         * @param {any} input
         * @returns {boolean}
         */
        isBoolean(input: any): boolean;
        /**
         *
         * @param {any} input
         * @returns {boolean}
         */
        isNumber(input: any): boolean;
        /**
         *
         * @param {any} input
         * @returns {boolean}
         */
        isString(input: any): boolean;
        /**
         *
         * @param {any} input
         * @returns {boolean}
         */
        isBuffer(input: any): boolean;
        /**
         *
         * @param {any} input
         * @returns {boolean}
         */
        isArray(input: any): boolean;
        /**
         *
         * @param {Record<string,any>} object
         * @param {string} path
         * @returns {any}
         */
        query(object: Record<string, any>, path: string): any;
        /**
         *
         * @param {Record<string,any>} object
         * @param {string} path
         * @param {any} value
         * @returns {any}
         */
        assign(object: Record<string, any>, path: string, value: any): any;
        /**
         *
         * @param {Record<string,any>} scope
         * @returns {Record<string,any>}
         */
        getEvaluationScope(scope: Record<string, any>): Record<string, any>;
        /**
         *
         * @param {string} script
         * @param {Record<string,any>} scope
         * @returns {any}
         */
        evaluate(script: string, scope: Record<string, any>): any;
        interpolate(input: any, scope: any): any;
        /**
         *
         * @param {AsyncIterable<any>} items
         * @returns {Promise<any[]>}
         */
        toArray(items: AsyncIterable<any>): Promise<any[]>;
        getTaskDefinition(task: any): Promise<any>;
        /**
         *
         * @param {MatcherCondition} condition
         * @returns {(it: Iterable<any>, handler: import('./async.js').Handler) => Promise<boolean>}
         */
        getTestConditionFunc(condition: MatcherCondition): (it: Iterable<any>, handler: import('./async.js').Handler) => Promise<boolean>;
        /**
         *
         * @param {Matcher} matcher
         * @param {any} input
         * @returns {Promise<boolean>}
         */
        test(matcher: Matcher, input: any): Promise<boolean>;
        /**
         *
         * @param {Matcher} matcher
         * @param {any} input
         * @returns {Promise<boolean>}
         */
        match(matcher: Matcher, input: any): Promise<boolean>;
        /**
         *
         * @param {MatcherTask} task
         * @param {any} input
         * @returns {Promise<boolean>}
         */
        matchWithTask(task: MatcherTask, input: any): Promise<boolean>;
        /**
         *
         * @param {Extractor} extractor
         * @param {Input} input
         * @returns {Promise<Record<string,any>>}
         */
        extract(extractor: Extractor, input: Input): Promise<Record<string, any>>;
        /**
         *
         * @param {ExtractorTask} task
         * @param {Input} input
         * @returns {Promise<Record<string,any>>}
         */
        extractWithTask(task: ExtractorTask, input: Input): Promise<Record<string, any>>;
        /**
         *
         * @param {string} taskName
         * @param {Task} task
         * @param {Input} input
         * @param {...any} args
         * @returns {Promise<{result: Output}|void>}
         */
        executeTask(taskName: string, task: Task, input: Input, ...args: any[]): Promise<{
            result: Output;
        } | void>;
        /**
         *
         * @param {string} taskName
         * @param {Task} task
         * @param {Input} input
         * @param  {...any} args
         * @returns {Promise<TaskResult>}
         */
        runTask(taskName: string, task: Task, input: Input, ...args: any[]): Promise<TaskResult>;
        runTaskSetIt(taskName: any, tasks: any, input: any, ...args: any[]): AsyncGenerator<TaskResult, void, unknown>;
        runTaskSet(taskName: any, tasks: any, input: any, ...args: any[]): Promise<any[]>;
        /**
         *
         * @param {Task} taskDefinitions
         * @param {Input} input
         * @param  {...any} args
         * @returns {AsyncGenerator<TaskResult>}
         */
        runTaskDefinitionsIt(taskDefinitions: Task, input: Input, ...args: any[]): AsyncGenerator<TaskResult>;
        /**
         *
         * @param {Task} taskDefinitions
         * @param {Input} input
         * @param  {...any} args
         * @returns {Promise<TaskResult[]>}
         */
        runTaskDefinitions(taskDefinitions: Task, input: Input, ...args: any[]): Promise<TaskResult[]>;
        /**
         *
         * @param {Input} input
         * @param  {...any} args
         * @returns {AsyncGenerator<TaskResult>}
         */
        runIt(input?: Input, ...args: any[]): AsyncGenerator<TaskResult>;
        /**
         *
         * @param {Input} input
         * @param  {...any} args
         * @returns {Promise<Execution>}
         */
        run(input?: Input, ...args: any[]): Promise<Execution>;
    }
    export { Tracer };
}
declare module "examples/analyzer" {
    export {};
}
declare module "examples/cascade" {
    export {};
}
declare module "examples/request" {
    export {};
}
declare module "examples/secrets" {
    export {};
}
declare module "examples/workflow" {
    export {};
}
declare module "lib/helper" {
    export type TaskResult = import("lib/template").TaskResult;
    export type Task = import("lib/template").Task;
    export type Input = import("lib/template").Input;
    export type TaskDefinition = {
        [taskName: string]: {
            alias?: string | string[];
            aliases?: string | string[];
            run?: (task: Task, input: Input, ...args: any) => void | TaskResult | Promise<void> | Promise<TaskResult>;
            handle?: (task: Task, input: Input, ...args: any) => void | TaskResult | Promise<void> | Promise<TaskResult>;
            handler?: (task: Task, input: Input, ...args: any) => void | TaskResult | Promise<void> | Promise<TaskResult>;
        };
    };
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
    export function createSuperTemplate(definition: TaskDefinition): typeof Template;
    import { Template } from "lib/template";
}
declare module "test/env.test" {
    export {};
}
declare module "test/template.test" {
    export {};
}
