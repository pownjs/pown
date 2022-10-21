exports.yargs = {
  command: 'get <tool> [name]',
  describe: 'get preferences',

  handler: async (argv) => {
    const { tool, name } = argv

    const { getPreferences } = require('../../../lib/preferences')

    const preferences = await getPreferences(tool)

    console.log(
      JSON.stringify(name ? preferences[name] : preferences, '', '  ')
    )
  },
}
