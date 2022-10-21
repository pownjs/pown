exports.yargs = {
  command: 'update',
  describe: 'Update global installation of pown',
  aliases: ['upgrade', 'up', 'u'],

  builder: (yargs) => {
    yargs.option('development', {
      type: 'boolean',
      describe: 'Install development.',
      alias: ['d', 'dev'],
      default: false,
    })
  },

  handler: async (yargs) => {
    const { development } = yargs

    const util = require('util')
    const { spawn } = require('child_process')

    const spawnAsync = util.promisify(spawn)

    await spawnAsync(
      'npm',
      [
        'install',
        '-g',
        'pown@latest',
        ...(development ? [] : ['--production']),
      ],
      { shell: true, stdio: 'inherit' }
    )
  },
}
