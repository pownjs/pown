const replacer = (key, value) => {
  if (value instanceof Error) {
    return (value.message || value).toString()
  } else {
    return value
  }
}

module.exports = { replacer }
