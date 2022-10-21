const ensureArray = (input) => {
  return Array.isArray(input) ? input : input ? [input] : []
}

const ensureObject = (input) => {
  return typeof input === 'object' ? input : { value: input }
}

const btoa = (input) =>
  (!Buffer.isBuffer(input) ? Buffer.from(input) : input).toString('base64')
const atob = (input) => Buffer.from(input, 'base64')

const dict = (input) => input
const list = (input) => input

const ret = (input) => input

module.exports = {
  ensureArray,
  ensureObject,

  btoa,
  atob,

  dict,
  list,

  ret,
}
