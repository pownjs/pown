exports.yargs = {
  command: 'export [file]',
  describe: 'Export leaks database',
  aliases: [],

  builder: {
    type: {
      alias: ['t'],
      type: 'string',
      default: 'json',
      choices: ['json', 'yaml', 'gitleaks'],
    },
  },

  handler: async (argv) => {
    const { type, file } = argv

    let re2

    try {
      re2 = require('re2')
    } catch (e) {}

    const fs = require('fs')
    const jsYaml = require('js-yaml')
    const { promisify } = require('util')

    const writeFileAsync = promisify(fs.writeFile)

    const database = require('../../../../lib/database')

    let output

    if (file) {
      output = async (data) => {
        await writeFileAsync(file, data)
      }
    } else {
      output = (data) => {
        console.log(data)
      }
    }

    switch (type) {
      case 'json':
        await output(JSON.stringify(database, '', '  '))

        return

      case 'yaml':
        await output(jsYaml.dump(database, '', '  '))

        return

      case 'gitleaks':
        await output(
          Object.values(database)
            .map(({ checks }) => {
              const items = []

              checks.forEach(
                ({ title, description, regex, flags = 'i', tags }) => {
                  if (re2) {
                    try {
                      new re2(regex, flags)
                    } catch (e) {
                      console.info(
                        `regulra expression ${JSON.stringify(
                          regex
                        )} incompatible with gitleaks`
                      )

                      return
                    }
                  }

                  items.push('[[rules]]')
                  items.push(
                    `  description = ${JSON.stringify(
                      description || title || ''
                    )}`
                  )
                  items.push(
                    `  regex = '''${flags ? `(?${flags})` : ''}${regex}'''`
                  )

                  // TODO: support gitleaks entropy

                  if (tags) {
                    items.push(`tags = ${JSON.stringify(tags)}`)
                  }
                }
              )

              return items.join('\n')
            })
            .join('\n\n')
        )

        return

      default:
        throw new Error(`Unexpected type ${type}`)
    }
  },
}
