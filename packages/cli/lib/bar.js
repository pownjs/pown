const { Bar: _Bar, Presets } = require('cli-progress')

class Bar extends _Bar {
  constructor(options) {
    super(options, Presets.shades_classic)
  }
}

module.exports = { Bar }
