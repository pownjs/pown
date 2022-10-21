const os = require('os')
const path = require('path')
const process = require('process')
const { promisify } = require('util')
const {
  mkdir,
  mkdirSync,
  exists,
  existsSync,
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
} = require('fs')

const mkdirAsync = promisify(mkdir)
const existsAsync = promisify(exists)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const callbackify = (func) => {
  return (...args) => {
    const callback = args.pop()

    if (typeof callback === 'function') {
      const promise = func(...args)

      promise
        .then((result) => callback(null, result))
        .catch((error) => callback(error, null))
    } else {
      return func(...args, callback)
    }
  }
}

const getPreferencesDirectory = (tool) => {
  return path.join(os.homedir(), process.env.POWN_HOME || '.pown', tool)
}

const ensurePreferencesDirectory = async (tool) => {
  const dirname = getPreferencesDirectory(tool)

  if (!(await existsAsync(dirname))) {
    await mkdirAsync(dirname, { recursive: true })
  }
}

const ensurePreferencesDirectorySync = (tool) => {
  const dirname = getPreferencesDirectory(tool)

  if (!existsSync(dirname)) {
    mkdirSync(dirname, { recursive: true })
  }
}

const getPreferencesFilename = (tool, filename = 'preferences.json') => {
  return path.join(getPreferencesDirectory(tool), filename)
}

const ensurePreferencesFilename = async (
  tool,
  filename = 'preferences.json'
) => {
  const pathname = getPreferencesFilename(tool, filename)

  if (!(await existsAsync(pathname))) {
    await ensurePreferencesDirectory(tool)

    writeFileAsync(pathname, '{}')
  }
}

const ensurePreferencesFilenameSync = (tool, filename = 'preferences.json') => {
  const pathname = getPreferencesFilename(tool, filename)

  if (!existsSync(pathname)) {
    ensurePreferencesDirectorySync(tool)

    writeFileSync(pathname, '{}')
  }
}

const getPreferences = callbackify(async (tool) => {
  await ensurePreferencesFilename(tool)

  const pathname = getPreferencesFilename(tool)

  const data = await readFileAsync(pathname)

  return JSON.parse(data.toString() || '{}')
})

const getPreferencesSync = (tool) => {
  ensurePreferencesFilenameSync(tool)

  const pathname = getPreferencesFilename(tool)

  const data = readFileSync(pathname)

  return JSON.parse(data.toString() || '{}')
}

const setPreferences = callbackify(async (tool, preferences) => {
  await ensurePreferencesFilename(tool)

  const pathname = getPreferencesFilename(tool)

  const data = JSON.stringify(preferences)

  await writeFileAsync(pathname, data)
})

const setPreferencesSync = (tool, preferences) => {
  ensurePreferencesFilenameSync(tool)

  const pathname = getPreferencesFilename(tool)

  const data = JSON.stringify(preferences)

  writeFileSync(pathname, data)
}

module.exports = {
  getPreferencesDirectory,
  ensurePreferencesDirectory,
  ensurePreferencesDirectorySync,

  getPreferencesFilename,
  ensurePreferencesFilename,
  ensurePreferencesFilenameSync,

  getPreferences,
  getPreferencesSync,

  setPreferences,
  setPreferencesSync,
}
