const { Console } = require('console')

const colors = require('./colors')
const { Table } = require('./table')
const { replacer } = require('./json')

const outConsole = new Console({
  stdout: process.stdout,
  stderr: process.stdout,
  groupIndentation: 0,
})
const errConsole = new Console({
  stdout: process.stderr,
  stderr: process.stderr,
  groupIndentation: 0,
})
const sysConsole = new Console({
  stdout: process.stderr,
  stderr: process.stderr,
  groupIndentation: 0,
})

const LABEL_FN =
  (fn) =>
  (symbol, value, ...args) =>
    fn(`${symbol} ${value}`, ...args)
const BLANK_FN = () => () => 0

const MAX_PROPERTYLESS_ROWS = 1000
const MAX_HEAD_FIELDS = 5

const consoleDef = {
  error: [errConsole, 'x', 'red'],
  warn: [errConsole, '!', 'yellow'],

  log: [outConsole, '', ''],

  info: [sysConsole, '*', 'green'],
  debug: [sysConsole, '%', 'magenta'],

  assert: [
    errConsole,
    '',
    '',
    () => {
      return (value, ...args) => {
        if (!value) {
          console.error('assertion failed:', ...args)
        }
      }
    },
  ],

  time: [sysConsole, '*', 'cyan', LABEL_FN],
  timeLog: [sysConsole, '*', 'cyan', LABEL_FN],
  timeEnd: [sysConsole, '*', 'cyan', LABEL_FN],

  count: [sysConsole, '*', 'green', LABEL_FN],
  countReset: [sysConsole, '*', 'green', LABEL_FN],

  dir: [sysConsole, '', '', BLANK_FN],
  dirxml: [sysConsole, '', '', BLANK_FN],

  group: [
    sysConsole,
    '',
    '',
    (fn) => (group) => fn(colors.white.bgRed(' ' + group + ' ')),
  ],
  groupCollapsed: [
    sysConsole,
    '',
    '',
    (fn) => (group) => fn(colors.white.bgRed(' ' + group + ' ')),
  ],
  groupEnd: [sysConsole],
}

const init = () => {
  const defaultOutputFormat = process.stdout.isTTY ? 'pown' : 'text'

  switch (process.env.POWN_CONSOLE_OUTPUT_FORMAT || defaultOutputFormat) {
    case 'node':
      Object.keys(consoleDef).forEach((type) => {
        console[type] = (
          (fn) =>
          (...args) => {
            fn(...args)
          }
        )(console[type])
      })

      break

    case 'text':
      Object.keys(consoleDef).forEach((type) => {
        console[type] = (
          (fn) =>
          (...args) => {
            fn(...args)
          }
        )(console[type])
      })

      break

    case 'json':
      Object.keys(consoleDef).forEach((type) => {
        console[type] = (
          (fn) =>
          (...args) => {
            try {
              fn(
                JSON.stringify(
                  { type, data: args.length > 1 ? args : args[0] },
                  replacer
                )
              )
            } catch (e) {
              console.error(e)
            }
          }
        )(console[type])
      })

      break

    case 'pown':
    default:
      Object.entries(consoleDef).forEach(
        ([type, [proto, symbol, color, fn]]) => {
          if (symbol || color) {
            let colorFn

            if (color) {
              colorFn = colors[color]
            } else {
              colorFn = (i) => i
            }

            console[type] = (
              (fn) =>
              (...args) => {
                fn(colorFn(symbol), ...args)
              }
            )(fn ? fn((proto || console)[type]) : (proto || console)[type])
          } else {
            console[type] = fn
              ? fn((proto || console)[type])
              : (proto || console)[type]
          }
        }
      )
  }

  if (
    process.env.POWN_DEBUG ||
    process.env.POWN_DEBUG_L ||
    process.env.POWN_DEBUG_XL ||
    process.env.POWN_DEBUG_XXL
  ) {
    if (!process.env.POWN_DEBUG_L) {
      console.debug = (
        (fn) =>
        (...args) => {
          fn(
            ...args.map((data) =>
              data && Buffer.isBuffer(data) ? data.slice(0, 64) : data
            )
          )
        }
      )(console.debug)
    } else if (!process.env.POWN_DEBUG_XL) {
      console.debug = (
        (fn) =>
        (...args) => {
          fn(
            ...args.map((data) =>
              data && Buffer.isBuffer(data) ? data.slice(0, 512) : data
            )
          )
        }
      )(console.debug)
    } else if (!process.env.POWN_DEBUG_XXL) {
      console.debug = (
        (fn) =>
        (...args) => {
          fn(
            ...args.map((data) => (data && Buffer.isBuffer(data) ? data : data))
          )
        }
      )(console.debug)
    }
  } else {
    console.debug = () => {}

    console.error = (
      (fn) =>
      (...args) => {
        fn(
          ...args.map((error) =>
            error && error.message ? error.message : error
          )
        )
      }
    )(console.error)
  }

  switch (
    process.env.POWN_CONSOLE_TABLE_OUTPUT_FORMAT ||
    process.env.POWN_CONSOLE_OUTPUT_FORMAT ||
    defaultOutputFormat
  ) {
    case 'node':
      console.table = (data) => {
        outConsole.table(data)
      }

      break

    case 'text':
      console.table = (data, properties = null, options = {}) => {
        if (!Array.isArray(data)) {
          data = Object.entries(data).map(([key, value]) => ({ key, value }))
        }

        if (!properties && data.length > MAX_PROPERTYLESS_ROWS) {
          console.warn(
            'attempting to print a table with too many rows and anundefined number of properties'
          )
        }

        let head =
          properties ||
          Array.from(
            new Set(
              data.reduce((a, v) => {
                return a.concat(Object.keys(v))
              }, [])
            )
          )

        if (head.length > MAX_HEAD_FIELDS) {
          console.warn(
            `table head is ${
              MAX_HEAD_FIELDS - head.length
            } fields larger then the maximum supported`
          )
        }

        head = head.slice(0, MAX_HEAD_FIELDS)

        const { span = true, wrap = true } = options

        const screenWidth = 80

        const colWidth = Math.floor(screenWidth / head.length)

        const table = new Table({
          head: head,
          wordWrap: wrap,
          colWidths: Array(head.length).fill(colWidth),

          chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: '',
          },

          style: {
            'padding-left': 0,
            'padding-right': 0,

            head: [],
            border: [],
          },
        })

        if (span) {
          data.forEach((entry) => {
            entry = head.map((n) =>
              entry[n] || typeof entry[n] === 'number'
                ? entry[n].toString
                  ? entry[n].toString()
                  : '-'
                : ''
            )

            for (let i = entry.length - 1, j = entry.length - 1; i >= 0; i--) {
              if (entry[i]) {
                const span = j - i + 1

                if (span > 1) {
                  entry[i] = { content: entry[i], colSpan: span }
                }

                j = i - 1
              }
            }

            entry = entry.filter((i) => i)

            table.push(entry)
          })
        } else {
          data.forEach((entry) => {
            entry = head.map((n) =>
              entry[n] ? (entry[n].toString ? entry[n].toString() : '-') : ''
            )

            table.push(entry)
          })
        }

        outConsole.log(table.toString())
      }

      break

    case 'json':
      console.table = (data) => {
        try {
          outConsole.log(JSON.stringify({ type: 'table', data: data }))
        } catch (e) {
          console.error(e)
        }
      }

      break

    case 'pown':
    default:
      console.table = (data, properties = null, options = {}) => {
        if (!Array.isArray(data)) {
          data = Object.entries(data).map(([key, value]) => ({ key, value }))
        }

        if (!properties && data.length > MAX_PROPERTYLESS_ROWS) {
          console.warn(
            'attempting to print a table with too many rows and an undefined number of properties'
          )
        }

        let head =
          properties ||
          Array.from(
            new Set(
              data.reduce((a, v) => {
                return a.concat(Object.keys(v))
              }, [])
            )
          ).slice(0, MAX_HEAD_FIELDS)

        if (head.length > MAX_HEAD_FIELDS) {
          console.warn(
            `table head is ${
              MAX_HEAD_FIELDS - head.length
            } fields larger then the maximum supported`
          )
        }

        head = head.slice(0, MAX_HEAD_FIELDS)

        const { span = true, wrap = true } = options

        const screenWidth = Math.floor((process.stdout.columns * 0.8) / 2) * 2

        const colWidth = Math.floor(screenWidth / head.length)

        const table = new Table({
          head: head,
          wordWrap: wrap,
          colWidths: Array(head.length).fill(colWidth),
        })

        if (span) {
          data.forEach((entry) => {
            entry = head.map((n) =>
              entry[n] || typeof entry[n] === 'number'
                ? entry[n].toString
                  ? entry[n].toString()
                  : '-'
                : ''
            )

            for (let i = entry.length - 1, j = entry.length - 1; i >= 0; i--) {
              if (entry[i]) {
                const span = j - i + 1

                if (span > 1) {
                  entry[i] = { content: entry[i], colSpan: span }
                }

                j = i - 1
              }
            }

            entry = entry.filter((i) => i)

            table.push(entry)
          })
        } else {
          data.forEach((entry) => {
            entry = head.map((n) =>
              entry[n] ? (entry[n].toString ? entry[n].toString() : '-') : ''
            )

            table.push(entry)
          })
        }

        outConsole.log(table.toString())
      }
  }
}

module.exports = { init }
