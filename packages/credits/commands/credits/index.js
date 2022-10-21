exports.yargs = {
  command: 'credits [options]',
  describe: 'list contributors and credits',

  builder: {
    only: {
      type: 'boolean',
      alias: 'o',
      describe: 'Only Pown.js contributors',
    },
  },

  handler: async (argv) => {
    const modules = require('@pown/modules')
    const wrap = require('@pown/cli/lib/wrap')
    const colors = require('@pown/cli/lib/colors')

    console.log(
      colors.yellow(`
+----------------------------------------------+
|                                              |
|   88888b.   .d88b.  888  888  888 88888b.    |
|   888 "88b d88""88b 888  888  888 888 "88b   |
|   888  888 888  888 888  888  888 888  888   |
|   888 d88P Y88..88P Y88b 888 d88P 888  888   |
|   88888P"   "Y88P"   "Y8888888P"  888  888   |
|   888    d8b                                 |
|   888    Y8P                                 |
|   888                                        |
|         8888 .d8888b                         |
|         "888 88K                             |
|          888 "Y8888b.                        |
|          888      X88                        |
|          888  88888P'                        |
|          888                                 |
|         d88P                                 |
|       888P"                                  |
|                                              |
+----------------------------------------------+
`)
    )

    console.log(
      wrap(
        `\n${colors.magenta('Pown.js is proudly sponsored by:')}\n\n${[
          'SecApps - https://secapps.com',
          'Websecurify - https://websecurify.com',
        ].join('\n')}\n`
      )
    )

    let list

    if (argv.only) {
      list = modules.listPownModules.bind(modules)
    } else {
      list = modules.listNodeModules.bind(modules)
    }

    let selectedModules

    try {
      selectedModules = await list()
    } catch (e) {
      console.error(e)

      return
    }

    let people = []

    selectedModules.forEach((module) => {
      if (module.package.author) {
        people.push(module.package.author.name.trim())
      }

      if (module.package.contributors) {
        people = people.concat(
          module.package.contributors.map((person) => person.name.trim())
        )
      }
    })

    if (people.length) {
      console.log(
        wrap(
          `\n${colors.magenta(
            'Pown.js is possible because of the following people:'
          )}\n\n${Array.from(new Set(people)).join(', ')}\n`
        )
      )
    }
  },
}
