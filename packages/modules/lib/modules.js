const path = require('path')
const { promisify } = require('util')
const { exists, readFile } = require('fs')
const readPackageTree = require('read-package-tree')

const existsAsync = promisify(exists)
const readFileAsync = promisify(readFile)
const readPackageTreeAsync = promisify(readPackageTree)

const maxLevel = process.env.POWN_MODULES_MAX_LEVEL || Infinity

const flattenModuleTree = async (tree) => {
  function* unravel(node, level) {
    if (level > maxLevel) {
      return
    } else {
      level = level + 1
    }

    yield {
      config: node.package.pown,
      package: node.package,
      realpath: node.realpath,
    }

    if (level <= maxLevel) {
      for (let i = 0; i < node.children.length; i++) {
        yield* unravel(node.children[i], level)
      }
    }
  }

  return Array.from(unravel(tree, 0))
}

const loadModuleConfigs = async (modules) => {
  return Promise.all(
    modules.map(async (module) => {
      if (!module.config) {
        const pathname = path.join(module.realpath, '.pownrc')

        const exists = await existsAsync(pathname)

        if (exists) {
          const data = await readFileAsync(pathname)

          module.config = JSON.parse(data.toString())
        }
      }

      return module
    })
  )
}

const defaultRoot = process.env.POWN_ROOT || path.dirname(require.main.filename)
const defaultPaths = [defaultRoot].concat(
  (process.env.POWN_PATH || '')
    .split(path.delimiter)
    .map((p) => p.trim())
    .filter((p) => p)
)

const memoryKey = 'c77d16c6-e989-40b6-b23a-9afad51fa9fb'
const memory = (global[memoryKey] = global[memoryKey] ? global[memoryKey] : {})

const memorize = (name, func) => {
  return async (...args) => {
    const result = await func(...args)

    memory[name] = result

    return result
  }
}

const callbackify = (func) => {
  return (paths, callback) => {
    switch (typeof paths) {
      case 'undefined':
        callback = undefined
        paths = defaultPaths
        break
      case 'function':
        callback = paths
        paths = defaultPaths
        break
    }

    const promise = func(paths)

    if (callback) {
      promise
        .then((result) => callback(null, result))
        .catch((error) => callback(error, null))

      return
    }

    return promise
  }
}

const listNodeModules = callbackify(async (paths) => {
  const trees = []

  for (let path of paths) {
    const tree = await readPackageTreeAsync(path)
    const flatTree = await flattenModuleTree(tree)

    trees.push(flatTree)
  }

  return [].concat(...trees)
})

const listPownModules = callbackify(async (paths) => {
  const nodeModules = await listNodeModules(paths)
  const extendedNodeModules = await loadModuleConfigs(nodeModules)
  const filteredModules = extendedNodeModules.filter((module) => module.config)

  return filteredModules
})

const list = listPownModules

const extractPownModules = callbackify(
  memorize('extractPownModules', async (paths) => {
    const modules = await listPownModules(paths)

    let loadableModules = {}
    let loadableCommands = []
    let loadableTransforms = []

    modules.forEach((module) => {
      // NOTE: add additional module types here

      if (module.config.main) {
        loadableModules[module.package.name] = path.resolve(
          module.realpath,
          module.config.main
        )
      }

      if (module.config.command) {
        loadableCommands = loadableCommands.concat([
          path.resolve(module.realpath, module.config.command),
        ])
      }

      if (module.config.commands) {
        loadableCommands = loadableCommands.concat(
          module.config.commands.map((command) =>
            path.resolve(module.realpath, command)
          )
        )
      }

      if (module.config.transform) {
        loadableTransforms = loadableTransforms.concat([
          path.resolve(module.realpath, module.config.transform),
        ])
      }

      if (module.config.transforms) {
        loadableTransforms = loadableTransforms.concat(
          module.config.transforms.map((transform) =>
            path.resolve(module.realpath, transform)
          )
        )
      }

      // TODO: create a generic way to do this
    })

    return { loadableModules, loadableCommands, loadableTransforms }
  })
)

const extract = extractPownModules

const extractPownModulesSync = () => {
  if (memory['extractPownModules']) {
    return memory['extractPownModules']
  } else {
    throw new Error(`Pown modules not avaialble`)
  }
}

const extractSync = extractPownModulesSync

const hasNodeModule = (module) => {
  try {
    require.resolve(module)
  } catch (e) {
    return false
  }

  return true
}

const hasPownModule = (module) => {
  try {
    require.resolve(module)
  } catch (e) {
    return false
  }

  return true
}

const atain = async (module) => {
  try {
    return require(module)
  } catch (e) {
    if (
      e.code === 'ERR_REQUIRE_ESM' ||
      e.message === 'Cannot use import statement outside a module'
    ) {
      return await import(module)
    }

    throw e
  }
}

module.exports = {
  listNodeModules,
  listPownModules,
  list,

  extractPownModules,
  extract,

  extractPownModulesSync,
  extractSync,

  hasNodeModule,
  hasPownModule,

  atain,
}
