let cache

const getCache = () => {
  return cache
}

const setCache = (c) => {
  cache = c
}

const clearCache = () => {
  cache = undefined
}

module.exports = { getCache, setCache, clearCache }
