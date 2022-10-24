const { eachMatch } = require('@pown/regexp/lib/eachMatch')

const modules = {
  title: 'NPM Module',

  severity: 1,

  scan: function* (input) {
    for (let match of eachMatch(
      /"(?:dependencies|devDependencies)":\s*(\{.+?\})/g,
      input
    )) {
      const { index, 1: find } = match

      let deps

      try {
        deps = JSON.parse(find)
      } catch (e) {}

      if (deps) {
        for (let [name, version] of Object.entries(deps)) {
          yield { index, find: `${name}@${version}` }
        }
      }
    }
  },
}

module.exports = {
  title: 'NPM Module Enumeration',
  checks: [modules],
}
