function isIterable(obj) {
  if (!obj) {
    return false
  }

  return (
    typeof obj[Symbol.iterator] === 'function' ||
    typeof obj[Symbol.asyncIterator] === 'function'
  )
}

function isSyncIterable(obj) {
  if (!obj) {
    return false
  }

  return typeof obj[Symbol.asyncIterator] === 'function'
}

function isAsyncIterable(obj) {
  if (!obj) {
    return false
  }

  return typeof obj[Symbol.asyncIterator] === 'function'
}

function isString(obj) {
  return typeof obj === 'string' || obj instanceof String
}

async function toArray(iterable) {
  const items = []

  for await (let item of iterable) {
    items.push(item)
  }

  return items
}

module.exports = {
  isIterable,
  isSyncIterable,
  isAsyncIterable,
  isString,
  toArray,
}
