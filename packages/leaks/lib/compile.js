const { regExp } = require('@pown/regexp/lib/regexp')
const { eachMatch } = require('@pown/regexp/lib/eachMatch')

const { calculateEntropy } = require('./entropy')

const compileCheck = (check) => {
  const {
    regex = '',
    filterRegex = '',
    locationRegex,
    locationFilterRegex,
    flags = '',
    filterFlags = '',
    locationFlags = '',
    locationFilterFlags = '',
    entropy,
    entropyScore,
    ...rest
  } = check

  const r = regex
    ? regExp(regex, [...new Set('g' + flags)].join(''))
    : undefined

  const fr = filterRegex ? regExp(filterRegex, filterFlags) : undefined

  const lr = locationRegex ? regExp(locationRegex, locationFlags) : undefined

  const lfr = locationFilterRegex
    ? regExp(locationFilterRegex, locationFilterFlags)
    : undefined

  const enc = entropyScore || entropy || 0

  const validate = (exact, find) => {
    if (enc && calculateEntropy(exact) < enc) {
      return false
    }

    if (fr && fr.test(find)) {
      return false
    }

    return true
  }

  return {
    ...rest,

    regex: r,

    filterRegex: fr,

    locationRegex: lr,

    locationFilterRegex: lfr,

    entropyScore: enc,

    scan: function* (input, options) {
      const { location } = options || {}

      if (lr) {
        if (!location || !lr.test(location)) {
          return
        }
      }

      if (lfr) {
        if (!location || lfr.test(location)) {
          return
        }
      }

      for (let match of eachMatch(r, input)) {
        const { index, 0: i0, groups = {} } = match

        const exact = groups.exact || i0
        const find = groups.find || i0

        if (validate(exact, find)) {
          yield {
            check,
            index,
            exact,
            find,
            entropy: calculateEntropy(exact),
            location,
          }
        }
      }
    },
  }
}

const compileCollection = (collection) => {
  const { checks, ...rest } = collection

  return {
    ...rest,

    checks: checks.map(compileCheck),
  }
}

const compileDatabase = (database) => {
  const { ...rest } = database

  return Object.assign(
    {},
    ...Object.entries(rest).map(([name, collection]) => {
      return {
        [name]: compileCollection(collection),
      }
    })
  )
}

module.exports = { compileCheck, compileCollection, compileDatabase }
