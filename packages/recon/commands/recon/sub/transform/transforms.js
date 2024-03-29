const { extractSync, atain } = require('@pown/modules')
const { getPreferencesSync } = require('@pown/preferences')

const { buildRemoteTransforms } = require('../../../../lib/remote')

const getCompoundTransforms = async () => {
  const { remotes = {} } = getPreferencesSync('recon')

  const remoteTransforms = buildRemoteTransforms(remotes)

  const { loadableTransforms } = extractSync()

  return {
    ...remoteTransforms,

    ...Object.assign(
      {},
      ...(await Promise.all(
        loadableTransforms.map(async (module) => {
          let transforms

          try {
            transforms = await atain(module)
          } catch (e) {
            if (process.env.POWN_DEBUG) {
              console.error(e)
            }

            return {}
          }

          return Object.assign(
            {},
            ...Object.entries(transforms)
              .filter(([name]) => name !== 'default')
              .map(([name, Transform]) => {
                return {
                  [name]: class extends Transform {
                    static loadableTransformModule = module
                    static loadableTransformName = name
                  },
                }
              })
          )
        })
      ))
    ),
  }
}

module.exports = { getCompoundTransforms }
