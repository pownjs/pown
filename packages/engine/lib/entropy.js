// see https://gist.github.com/ppseprus/afab8500dec6394c401734cb6922d220

/**
 *
 * @param {string} chr
 * @param {string} str
 * @returns {number}
 */
const getCharacterFrequency = (chr, str) => {
  let c = 0
  let i = -1

  while ((i = str.indexOf(chr, i + 1)) >= 0) {
    c += 1
  }

  return c
}

/**
 *
 * @param {string} str
 * @returns {number}
 */
const calculateEntropy = (str) => {
  // TODO: make this forward compatible
  // @ts-ignore
  return (
    [...new Set(str)]
      .map((chr) => getCharacterFrequency(chr, str))
      .reduce((sum, frequency) => {
        const p = frequency / str.length

        return sum + p * Math.log2(1 / p)
      }, 0) * str.length
  )
}

module.exports = {
  calculateEntropy,
}
