let Re2

try {
  Re2 = require('re2')
} catch (e) {
  void 0
}

const _RegExp = typeof Re2 === 'function' ? Re2 : RegExp

const regExp = (source, flags) => {
  try {
    return new _RegExp(source, flags)
  } catch (e) {
    if (/invalid perl operator/.test(e.message)) {
      return new RegExp(source, flags)
    } else {
      throw e
    }
  }
}

module.exports = { RegExp: _RegExp, regExp }
