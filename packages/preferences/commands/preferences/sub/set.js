exports.yargs = {
    command: 'set <tool> <name> <value>',
    describe: 'set preferences',

    handler: async(argv) => {
        const { tool, name, value } = argv

        const { getPreferences, setPreferences } = require('../../../lib/preferences')

        const preferences = await getPreferences(tool)

        preferences[name] = JSON.parse(value)

        await setPreferences(tool, preferences)

        console.log(JSON.stringify(preferences[name], '', '  '))
    }
}
