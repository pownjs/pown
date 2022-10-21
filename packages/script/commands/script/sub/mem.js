exports.yargs = {
  command: 'mem',
  describe: 'Print current memory usage',

  builder: {},

  handler: (argv) => {
    const os = require('os')
    const process = require('process')

    console.info(
      `freemem=${Math.round((os.freemem() / 1024 / 1024) * 100) / 100}MB`,
      ...Object.entries(process.memoryUsage()).map(
        ([name, value]) =>
          `${name}=${Math.round((value / 1024 / 1024) * 100) / 100}MB`
      )
    )
  },
}
